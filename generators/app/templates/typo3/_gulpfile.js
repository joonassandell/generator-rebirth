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

const production = process.env.NODE_ENV === 'production';

/* ======
 * Config
 * ====== */

const config = {
  root: '/',
  ext: '<%= dir %>',
};

/* ======
 * Tasks
 * ====== */

/**
 * Stylesheets
 */
gulp.task('stylesheets', function() {
  let pipeline = gulp
    .src('Assets/index.scss')
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
            '/typo3conf/ext/',
            config.ext,
            '/Resources/Public/Assets/',
          ),
        ),
      )
      .pipe($.combineMq({ beautify: false }))
      .pipe(
        $.cssnano({
          mergeRules: false,
          zindex: false,
          discardComments: { removeAll: true },
        }),
      )
      .pipe(gulp.dest('Resources/Public/Assets/')));
  } else {
    return (pipeline = pipeline
      .pipe(gulp.dest('Resources/Public/Assets/'))
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
      entries: 'Assets/' + entry.fileName,
      debug: !production,
      paths: ['Assets'],
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

      return collect
        .pipe(gulp.dest('Resources/Public/Assets/'))
        .on('end', reportFinished);
    };

    if (!production) {
      pipeline = watchify(pipeline).on('update', bundle);
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
    .src('Assets/images/*.{jpg,jpeg,png,gif,webp,svg}')
    .pipe($.changed('Resources/Public/Assets/images/'))
    .pipe(
      $.imagemin({
        svgoPlugins: [{ cleanupIDs: false }],
      }),
    )
    .on('error', handleError)
    .pipe(gulp.dest('Resources/Public/Assets/images/'));
});

/**
 * Fonts
 */
gulp.task('fonts', function() {
  return gulp
    .src('Assets/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.changed('Resources/Public/Assets/fonts/'))
    .on('error', handleError)
    .pipe(gulp.dest('Resources/Public/Assets/fonts/'));
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
gulp.task('watch', function(callback) {
  gulp
    .watch('Resources/Private/' + '**/*.html')
    .on('change', browserSync.reload);
  gulp.watch('Assets/**/**/*.scss', ['stylesheets']);
  gulp.watch('Assets/fonts/*.{eot,svg,ttf,woff,woff2}', ['fonts']);
  gulp.watch('Assets/images/*.{jpg,jpeg,png,gif,webp,svg}', ['images']);
});

/**
 * Tasks
 */
let tasks = ['stylesheets', 'javascripts', 'images', 'fonts'];

/**
 * Create dist files and inline <head> css/js
 */
gulp.task('createDistPartials', tasks, function() {
  return gulp
    .src(
      [
        'Resources/Private/Partials/Head.html',
        'Resources/Private/Partials/Foot.html',
      ],
      { base: 'Resources/Private/' },
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
    .pipe($.rename({ suffix: '.dist' }))
    .pipe(gulp.dest('Resources/Private/'));
});

/**
 * Revision
 */
gulp.task('rev', tasks.concat(['createDistPartials']), function() {
  rimraf.sync('Resources/Public/Assets/*.css');
  rimraf.sync('Resources/Public/Assets/head.js');
  rimraf.sync('Resources/Public/Assets/vendors/');

  return gulp
    .src([
      'Resources/Public/Assets/*.js',
      'Resources/Public/Assets/{images,fonts}/**',
    ])
    .pipe($.rev())
    .pipe(
      $.rename(function(path) {
        if (path.basename.indexOf('index-') > -1) {
          path.basename = path.basename.replace('index-', '');
        }
      }),
    )
    .pipe(gulp.dest('Resources/Public/Assets/'))
    .pipe(rmOriginalFiles())
    .pipe($.rev.manifest())
    .pipe(gulp.dest('./'));
});

/**
 * Update references
 */
gulp.task('updateReferences', tasks.concat(['rev']), function() {
  let manifest = gulp.src('./rev-manifest.json');

  return gulp
    .src(
      [
        'Resources/Public/Assets/**',
        'Resources/Private/Partials/Head.dist.html',
        'Resources/Private/Partials/Foot.dist.html',
      ],
      { base: 'Resources/Public/' },
    )
    .pipe(
      $.revReplace({
        manifest: manifest,
        replaceInExtensions: ['.js', '.css', '.html'],
      }),
    )
    .pipe(gulp.dest('Resources/Public/'));
});

/* ======
 * Main collected tasks
 * ====== */

gulp.task('build', function() {
  rimraf.sync('Resources/Public/Assets');

  gulp.start(tasks.concat(['createDistPartials', 'rev', 'updateReferences']));
});

gulp.task('default', ['build']);

gulp.task('dev', tasks.concat(['watch', 'server']));

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
        '<v:asset.script(.*?)path="(.*?)' + opts.matchFile + '"(.*?)>',
      );
    }
    return new RegExp(
      '<v:asset.style(.*?)path="(.*?)' + opts.matchFile + '"(.*?)>',
    );
  }

  if (opts.file) {
    let content;
    let tagBegin = '<v:asset.script standalone="true" movable="false">';
    let tagEnd = '</v:asset.script>';

    if (opts.file.match(/.js/)) {
      content = fs.readFileSync('Resources/Public/Assets/' + opts.file, 'utf8');
    } else {
      tagBegin = '<v:asset.style standalone="true">';
      tagEnd = '</v:asset.style>';
      content = fs.readFileSync('Resources/Public/Assets/' + opts.file, 'utf8');
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
