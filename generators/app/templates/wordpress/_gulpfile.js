/* =======================================
 * Gulpfile
 * ======================================= */

const fs = require('fs');
const browserify = require('browserify');
const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const notifier = require('node-notifier');
const path = require('path');
const prettyHrtime = require('pretty-hrtime');
const rimraf = require('rimraf');
const source = require('vinyl-source-stream');
const through = require('through2');
const watchify = require('watchify');
const $ = require('gulp-load-plugins')();
const uglify = require('gulp-uglify-es').default;
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');

const production = process.env.NODE_ENV === 'production';

/* ======
 * Config
 * ====== */

const config = {
  root: '/',
  theme: '<%= dir %>',
};

/* ======
 * Tasks
 * ====== */

/**
 * Stylesheets
 */
gulp.task('stylesheets', function() {
  let pipeline = gulp
    .src('assets/index.scss')
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
      .pipe(
        $.replace(
          './',
          path.join(
            config.root,
            'wp-content/themes/',
            config.theme,
            '/build/assets/',
          ),
        ),
      )
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
      .pipe(gulp.dest('build/assets/')));
  } else {
    return (pipeline = pipeline
      .pipe(gulp.dest('build/assets/'))
      .pipe(browserSync.stream()));
  }
});

/**
 * Javascripts
 */
gulp.task('javascripts', function(callback) {
  let scripts = [
    {
      fileName: 'index.js',
    },
    {
      fileName: 'head.js',
    },
  ];

  let bundleQueue = scripts.length;

  let browserifyBundle = function(entry) {
    let pipeline = browserify({
      entries: 'assets/' + entry.fileName,
      debug: !production,
      paths: ['assets'],
    });

    let bundle = function() {
      bundleLogger.start(entry.fileName);

      let collect = pipeline
        .bundle()
        .on('error', handleError)
        .pipe(source(entry.fileName));

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

      return collect.pipe(gulp.dest('build/assets/')).on('end', reportFinished);
    };

    if (!production) {
      if (process.env.ENABLE_WATCH) {
        pipeline = watchify(pipeline).on('update', bundle);
      }
    }

    let reportFinished = function() {
      bundleLogger.end(entry.fileName);

      if (bundleQueue) {
        bundleQueue--;
        if (bundleQueue === 0) {
          callback();
        }
      }
    };

    return bundle();
  };

  scripts.forEach(browserifyBundle);
});

/**
 * Images
 */
gulp.task('images', function() {
  return gulp
    .src('assets/images/*.{jpg,jpeg,png,gif,webp,svg}')
    .pipe($.changed('build/assets/images/'))
    .pipe(
      $.imagemin({
        svgoPlugins: [{ cleanupIDs: false }],
      }),
    )
    .on('error', handleError)
    .pipe(gulp.dest('build/assets/images/'));
});

/**
 * Fonts
 */
gulp.task('fonts', function() {
  return gulp
    .src('assets/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.changed('build/assets/fonts/'))
    .on('error', handleError)
    .pipe(gulp.dest('build/assets/fonts/'));
});

/**
 * Server
 */
gulp.task('server', function() {
  browserSync.init({
    open: process.env.DISABLE_OPEN ? false : 'external',
    port: 9001,
    proxy: process.env.DEVELOPMENT_URL
      ? process.env.DEVELOPMENT_URL
      : 'http://127.0.0.1:8000',
    notify: false,
    serveStatic: ['./'],
  });
});

/**
 * Watch
 */
gulp.task('watch', function() {
  gulp.watch('**/*.{php,twig}').on('change', browserSync.reload);
  gulp.watch('assets/**/**/*.scss', gulp.series('stylesheets'));
  gulp.watch('assets/fonts/*.{eot,svg,ttf,woff,woff2}', gulp.series('fonts'));
  gulp.watch(
    'assets/images/*.{jpg,jpeg,png,gif,webp,svg}',
    gulp.series('images'),
  );
});

/**
 * Create build files and inline <head> css/js
 */
gulp.task('createBuildPartials', function() {
  return gulp
    .src(
      ['partials/head.twig', 'partials/foot.twig', 'components/Icon.ref.twig'],
      { base: './' },
    )
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
    .pipe(gulp.dest('build/'));
});

/**
 * Revision and remove unneeded files
 */
gulp.task('rev', function() {
  rimraf.sync('build/assets/' + '*.css');
  rimraf.sync('build/assets/' + 'head.js');
  rimraf.sync('build/assets/' + 'vendors/');

  return gulp
    .src(['build/assets/*.js', 'build/assets/{images,fonts}/**'])
    .pipe($.rev())
    .pipe(
      $.rename(function(path) {
        if (path.basename.indexOf('index-') > -1) {
          path.basename = path.basename.replace('index-', '');
        }
      }),
    )
    .pipe(gulp.dest('build/assets'))
    .pipe(rmOriginalFiles())
    .pipe($.rev.manifest())
    .pipe(gulp.dest('./'));
});

/**
 * Update references
 */
gulp.task('updateReferences', function() {
  let manifest = gulp.src('./rev-manifest.json');

  return gulp
    .src(
      [
        'build/assets/**',
        'build/partials/head.twig',
        'build/partials/foot.twig',
        'build/components/Icon.ref.twig',
      ],
      { base: 'build/' },
    )
    .pipe(
      $.revReplace({
        manifest: manifest,
        replaceInExtensions: ['.js', '.css', '.php', '.twig'],
      }),
    )
    .pipe(gulp.dest('build/'));
});

/* ======
 * Main collected tasks
 * ====== */

gulp.task('clean', function(cb) {
  rimraf.sync('build/');
  cb();
});

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel('stylesheets', 'javascripts', 'images', 'fonts'),
    'createBuildPartials',
    'rev',
    'updateReferences',
  ),
);

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('stylesheets', 'javascripts', 'images', 'fonts'),
  ),
);

gulp.task(
  'watch',
  gulp.series(
    'clean',
    gulp.parallel(
      'stylesheets',
      'javascripts',
      'images',
      'fonts',
      'watch',
      'server',
    ),
  ),
);

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
      content = fs.readFileSync('build/assets/' + opts.file, 'utf8');
    } else {
      tagBegin = '<style>';
      tagEnd = '</style>';
      content = fs.readFileSync('build/assets/' + opts.file, 'utf8');
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
