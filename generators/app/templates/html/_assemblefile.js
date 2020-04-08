/* =======================================
 * Gulpfile
 * ======================================= */

const assemble = require('assemble');
const app = assemble();
const browserify = require('browserify');
const browserSync = require('browser-sync').create();
const color = require('ansi-colors');
const cssnano = require('cssnano');
const fs = require('fs');
const log = require('fancy-log');
const handlebarsHelpers = require('handlebars-helpers')();
const notifier = require('node-notifier');
const postcss = require('gulp-postcss');
const prettyHrtime = require('pretty-hrtime');
const rimraf = require('rimraf');
const source = require('vinyl-source-stream');
const through = require('through2');
const uglify = require('gulp-uglify-es').default;
const watch = require('base-watch');
const watchify = require('watchify');
const $ = require('gulp-load-plugins')();

const PRODUCTION = process.env.NODE_ENV === 'production';

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
  app.data({ dev: !PRODUCTION });
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
    .on('error', $.sass.logError)
    .pipe($.autoprefixer());

  if (PRODUCTION) {
    return (pipeline = pipeline
      .pipe($.replace(`../${config.buildPath}assets/`))
      .pipe($.combineMq({ beautify: false }))
      .pipe(
        postcss([
          cssnano({
            mergeRules: false,
            zindex: false,
            discardComments: { removeAll: true },
          }),
        ]),
      )
      .pipe(app.dest(config.stylesheets.dest)));
  } else {
    return (pipeline = pipeline
      .pipe(app.dest(config.stylesheets.dest))
      .pipe(browserSync.stream()));
  }
});

/**
 * JavaScripts
 */
app.task('javascripts', function(callback) {
  let bundleQueue = config.javascripts.bundle.length;

  const browserifyBundle = (entry) => {
    let pipeline = browserify({
      cache: {},
      packageCache: {},
      fullPaths: false,
      entries: `${config.javascripts.src}${entry.fileName}`,
      debug: !PRODUCTION,
    });

    const bundle = () => {
      bundleLog.start(entry.fileName);

      let collect = pipeline
        .bundle()
        .on('error', handleError)
        .pipe(source(entry.fileName));

      if (!PRODUCTION) {
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

    if (!PRODUCTION) {
      pipeline = watchify(pipeline).on('update', bundle);
    }

    const reportFinished = () => {
      bundleLog.end(entry.fileName);

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
        '/node_modules': 'node_modules',
      },
    },
  });
});

/**
 * Watch
 */
app.task('watch-files', function() {
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
    .src([`${config.dest}**/*.html`], { base: config.dest })
    .pipe($.replace(findFile('index.css'), () => inlineFile('index.css')))
    .pipe($.replace(findFile('head.js'), () => inlineFile('head.js')))
    .pipe(app.dest(config.dest));
});

/**
 * Revision and remove unneeded files
 */
app.task('rev', function() {
  rimraf.sync(`${config.stylesheets.dest}*.css`);
  rimraf.sync(`${config.javascripts.dest}head.js`);
  rimraf.sync(`${config.javascripts.dest}vendors/`);

  return app
    .src([
      `${config.javascripts.dest}**/*.js`,
      `${config.dest}assets/{images,fonts}/**`,
    ])
    .pipe($.rev())
    .pipe(
      $.rename(function(path) {
        if (path.basename.indexOf('index-') > -1) {
          path.basename = path.basename.replace('index-', '');
        }
      }),
    )
    .pipe(app.dest(`${config.dest}assets/`))
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
    .src([`${config.dest}**`], { base: config.dest })
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

app.task('watch', function() {
  rimraf.sync(config.dest);
  app.build(tasks.concat(['html']), app.parallel(['server', 'watch-files']));
});

/* ======
 * Utilities
 * ====== */

function handleError(err) {
  log.error(err);
  notifier.notify({
    title: 'Compile Error',
    message: err.message,
  });
  return this.emit('end');
}

function inlineFile(file) {
  if (file.match(/.js/)) {
    const content = fs.readFileSync(`build/assets/${file}`, 'utf8');
    return `<script>${content}</script>`;
  } else {
    const content = fs.readFileSync(`build/assets/${file}`, 'utf8');
    return `<style>${content}</style>`;
  }
}

function findFile(file) {
  if (file.match(/.js/)) {
    return new RegExp(`<script(.*?)src="(.*?)${file}"(.*?)>(.*?)</script>`);
  }
  return new RegExp(`<link(.*?)href="(.*?)${file}"(.*?)>`);
}

let startTime;
const bundleLog = {
  start: (filepath) => {
    startTime = process.hrtime();
    log('Bundling', color.green(filepath));
  },
  end: (filepath) => {
    let taskTime = process.hrtime(startTime);
    let prettyTime = prettyHrtime(taskTime);
    log(`Bundled ${color.green(filepath)} after ${color.magenta(prettyTime)}`);
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
