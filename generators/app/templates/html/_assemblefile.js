/* =======================================
 * Gulpfile
 * ======================================= */

const assemble = require('assemble');
const app = assemble();
const fs = require('fs');
const browserify = require('browserify');
const browserSync = require('browser-sync').create();
const handlebarsHelpers = require('handlebars-helpers')();
const notifier = require('node-notifier');
const path = require('path');
const prettyHrtime = require('pretty-hrtime');
const rimraf = require('rimraf');
const source = require('vinyl-source-stream');
const through = require('through2');
const watch = require('base-watch');
const watchify = require('watchify');
const $ = require('gulp-load-plugins')();
const uglify = require('gulp-uglify-es').default;
const production = process.env.NODE_ENV === 'production';

/* ======
 * Config
 * ====== */

const config = {
  src: 'src/',
  dest: 'build/',
  buildPath: '/',
  stylesheets: {
    src: 'src/assets/index.scss',
    dest: 'build/assets/',
    watch: 'src/assets/**/**/*.scss',
  },
  javascripts: {
    src: 'src/assets/',
    dest: 'build/assets/',
    bundle: [
      {
        fileName: 'index.js',
      },
      {
        fileName: 'head.js',
      },
    ],
  },
  images: {
    src: 'src/assets/images/*.{jpg,jpeg,png,gif,webp,svg}',
    dest: 'build/assets/images/',
    watch: 'src/assets/images/*.{jpg,jpeg,png,gif,webp,svg}',
  },
  fonts: {
    src: 'src/assets/fonts/*.{eot,svg,ttf,woff,woff2}',
    dest: 'build/assets/fonts/',
    watch: 'src/assets/fonts/*.{eot,svg,ttf,woff,woff2}',
  },
  html: {
    data: 'src/*.{json,yml}',
    dest: 'build/',
    helpers: 'src/helpers/*.js',
    containers: 'src/containers/*.hbs',
    partials: 'src/partials/*.hbs',
    templates: 'src/templates/**/*.hbs',
    watch: ['src/{containers,templates,partials}/**/*.hbs', 'src/*.{json,yml}'],
  },
};

/* ======
 * Tasks
 * ====== */

/**
 * Assemble
 */
app.data({ assets: 'assets' });
app.data(config.html.data);
app.helpers(config.html.helpers);
app.helpers(handlebarsHelpers);
app.use(watch());

app.preLayout(/\.hbs$/, function(view, next) {
  if (!view.layout) view.layout = 'app';
  next();
});

app.task('html', function() {
  app.data({ dev: !production });
  app.layouts(config.html.containers);
  app.partials(config.html.partials);

  return app
    .src(config.html.templates)
    .pipe(app.renderFile())
    .on('error', handleError)
    .pipe(
      $.rename(function(path) {
        if (path.basename != 'index') {
          path.dirname = path.dirname + '/' + path.basename;
          path.basename = 'index';
        }

        path.extname = '.html';
      }),
    )
    .pipe(app.dest(config.html.dest));
});

/**
 * Stylesheets
 */
app.task('stylesheets', function() {
  let pipeline = app
    .src(config.stylesheets.src)
    .pipe(
      $.sass({
        includePaths: ['node_modules'],
        outputStyle: 'expanded',
      }),
    )
    .on('error', handleError)
    .on('error', $.sass.logError)
    .pipe($.autoprefixer());

  if (production) {
    return (pipeline = pipeline
      .pipe($.replace('../', config.buildPath + 'assets/'))
      .pipe($.combineMq({ beautify: false }))
      .pipe($.cssnano({ mergeRules: false, zindex: false }))
      .pipe(app.dest(config.stylesheets.dest)));
  } else {
    return (pipeline = pipeline
      .pipe(app.dest(config.stylesheets.dest))
      .pipe(browserSync.stream()));
  }
});

/**
 * Javascripts
 */
app.task('javascripts', function(callback) {
  let bundleQueue = config.javascripts.bundle.length;

  let browserifyBundle = function(bundleConfig) {
    let pipeline = browserify({
      cache: {},
      packageCache: {},
      fullPaths: false,
      entries: config.javascripts.src + bundleConfig.fileName,
      debug: !production,
    });

    let bundle = function() {
      bundleLogger.start(bundleConfig.fileName);

      let collect = pipeline
        .bundle()
        .on('error', handleError)
        .pipe(source(bundleConfig.fileName));

      if (!production) {
        collect = collect.pipe(browserSync.stream());
      } else {
        collect = collect.pipe(
          $.streamify(
            uglify({
              compress: {
                drop_console: true,
              },
            }),
          ),
        );
      }

      return collect
        .pipe(app.dest(config.javascripts.dest))
        .on('end', reportFinished);
    };

    if (!production) {
      pipeline = watchify(pipeline).on('update', bundle);
    }

    let reportFinished = function() {
      bundleLogger.end(bundleConfig.fileName);

      if (bundleQueue) {
        bundleQueue--;
        if (bundleQueue === 0) {
          callback();
        }
      }
    };

    return bundle();
  };

  config.javascripts.bundle.forEach(browserifyBundle);
});

/**
 * Images
 */
app.task('images', function() {
  return app
    .src(config.images.src)
    .pipe($.changed(config.images.dest))
    .pipe(
      $.imagemin({
        svgoPlugins: [{ cleanupIDs: false }],
      }),
    )
    .on('error', handleError)
    .pipe(app.dest(config.images.dest));
});

/**
 * Fonts
 */
app.task('fonts', function() {
  return app
    .src(config.fonts.src)
    .pipe($.changed(config.fonts.dest))
    .on('error', handleError)
    .pipe(app.dest(config.fonts.dest));
});

/**
 * Server
 */
app.task('server', function() {
  browserSync.init({
    open: process.env.DISABLE_OPEN ? false : 'external',
    port: 9001,
    notify: false,
    server: {
      baseDir: config.dest,
      routes: {
        '/bower_components': 'bower_components',
        '/node_modules': 'node_modules',
      },
    },
  });
});

/**
 * Watch
 */
app.task('watch', function() {
  app.watch(config.html.watch, ['html'], function(cb) {
    setTimeout(function() {
      browserSync.reload();
      cb();
    }, 150);
  });
  app.watch(config.stylesheets.watch, ['stylesheets']);
  app.watch(config.fonts.watch, ['fonts']);
  app.watch(config.images.watch, ['images']);
});

/**
 * Inline <head> css/js
 */
app.task('inline', function() {
  return app
    .src([config.dest + '**/*.html'], { base: config.dest })
    .pipe(
      $.replace(inline({ matchFile: 'index.css' }), function() {
        return inline({ file: 'index.css' });
      }),
    )
    .pipe(
      $.replace(inline({ matchFile: 'head.js' }), function() {
        return inline({ file: 'head.js' });
      }),
    )
    .pipe(app.dest(config.dest));
});

/**
 * Revision and remove unneeded files
 */
app.task('rev', function() {
  rimraf.sync(config.stylesheets.dest + '*.css');
  rimraf.sync(config.javascripts.dest + 'head.js');
  rimraf.sync(config.javascripts.dest + 'vendors/');

  return app
    .src([
      config.javascripts.dest + '**/*.js',
      config.dest + 'assets/{images,fonts}/**',
    ])
    .pipe($.rev())
    .pipe(
      $.rename(function(path) {
        if (path.basename.indexOf('index-') > -1) {
          path.basename = path.basename.replace('index-', '');
        }
      }),
    )
    .pipe(app.dest(config.dest + 'assets/'))
    .pipe(rmOriginalFiles())
    .pipe($.rev.manifest())
    .pipe(app.dest('./'));
});

/**
 * Update references
 */
app.task('updateReferences', function() {
  let manifest = app.src('./rev-manifest.json');

  return app
    .src([config.dest + '**'], { base: config.dest })
    .pipe(
      $.revReplace({
        manifest: manifest,
        replaceInExtensions: ['.js', '.css', '.html'],
      }),
    )
    .pipe(app.dest(config.dest));
});

/* ======
 * Main collected tasks
 * ====== */

let tasks = ['stylesheets', 'javascripts', 'images', 'fonts'];

app.task('build', function() {
  rimraf.sync(config.dest);
  app.build(
    tasks.concat(['html', 'inline', 'rev', 'updateReferences']),
    function(err) {
      if (err) throw err;
    },
  );
});

app.task('default', ['build']);

app.task('dev', function() {
  rimraf.sync(config.dest);
  app.build(tasks.concat(['html']), app.parallel(['server', 'watch']));
});

/* ======
 * Utilities
 * ====== */

function handleError(err) {
  $.util.log(err);
  $.util.beep();
  notifier.notify({
    title: 'Compile Error',
    message: err.message,
  });
  return this.emit('end');
}

function inline(opts) {
  opts = opts || {};

  if (opts.matchFile) {
    if (opts.matchFile.match(/.js/)) {
      return new RegExp(
        '<script(.*?)src="(.*?)' + opts.matchFile + '"(.*?)>(.*?)</script>',
      );
    }
    return new RegExp('<link(.*?)href="(.*?)' + opts.matchFile + '"(.*?)>');
  }

  if (opts.file) {
    let content;
    let tagBegin = '<script>';
    let tagEnd = '</script>';

    if (opts.file.match(/.js/)) {
      content = fs.readFileSync(config.javascripts.dest + opts.file, 'utf8');
    } else {
      tagBegin = '<style>';
      tagEnd = '</style>';
      content = fs.readFileSync(config.stylesheets.dest + opts.file, 'utf8');
    }

    return tagBegin + content + tagEnd;
  }
}

let startTime,
  bundleLogger = {
    start: function(filepath) {
      startTime = process.hrtime();
      $.util.log('Bundling', $.util.colors.green(filepath));
    },
    end: function(filepath) {
      let taskTime = process.hrtime(startTime);
      let prettyTime = prettyHrtime(taskTime);
      $.util.log(
        'Bundled',
        $.util.colors.green(filepath),
        'after',
        $.util.colors.magenta(prettyTime),
      );
    },
  };

function rmOriginalFiles() {
  return through.obj(function(file, enc, cb) {
    if (file.revOrigPath) {
      fs.unlinkSync(file.revOrigPath);
    }

    this.push(file);
    return cb();
  });
}

module.exports = app;
