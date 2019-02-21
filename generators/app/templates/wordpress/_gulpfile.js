/* ========================================
 * Gulpfile
 * ======================================== */

var fs = require('fs');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var notifier = require('node-notifier');
var path = require('path');
var prettyHrtime = require('pretty-hrtime');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var through = require('through2');
var watchify = require('watchify');
var $ = require('gulp-load-plugins')();
var uglify = require('gulp-uglify-es').default;

var production = process.env.NODE_ENV === 'production';

/* ======
 * Config
 * ====== */

var config = {
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
  var pipeline = gulp
    .src('assets/app.scss')
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
            '/dist/assets/',
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
      .pipe(gulp.dest('dist/assets/')));
  } else {
    return (pipeline = pipeline
      .pipe(gulp.dest('dist/assets/'))
      .pipe(browserSync.stream()));
  }
});

/**
 * Javascripts
 */
gulp.task('javascripts', function(callback) {
  var scripts = [{ fileName: 'app.js' }, { fileName: 'app.head.js' }];

  var bundleQueue = scripts.length;

  var browserifyBundle = function(entry) {
    var pipeline = browserify({
      entries: 'assets/' + entry.fileName,
      debug: !production,
      paths: ['assets'],
    });

    var bundle = function() {
      bundleLogger.start(entry.fileName);

      var collect = pipeline
        .bundle()
        .on('error', handleError)
        .pipe(source(entry.fileName));

      if (!production) {
        collect = collect.pipe(browserSync.stream());
      } else {
        collect = collect.pipe($.streamify(uglify));
      }

      return collect.pipe(gulp.dest('dist/assets/')).on('end', reportFinished);
    };

    if (!production) {
      pipeline = watchify(pipeline).on('update', bundle);
    }

    var reportFinished = function() {
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
    .pipe($.changed('dist/assets/images/'))
    .pipe(
      $.imagemin({
        svgoPlugins: [{ cleanupIDs: false }],
      }),
    )
    .on('error', handleError)
    .pipe(gulp.dest('dist/assets/images/'));
});

/**
 * Fonts
 */
gulp.task('fonts', function() {
  return gulp
    .src('assets/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.changed('dist/assets/fonts/'))
    .on('error', handleError)
    .pipe(gulp.dest('dist/assets/fonts/'));
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
  gulp.watch('**/*.{php,twig}').on('change', browserSync.reload);
  gulp.watch('assets/**/**/*.scss', ['stylesheets']);
  gulp.watch('assets/fonts/*.{eot,svg,ttf,woff,woff2}', ['fonts']);
  gulp.watch('assets/images/*.{jpg,jpeg,png,gif,webp,svg}', ['images']);
});

/**
 * Combined tasks
 */
var tasks = ['stylesheets', 'javascripts', 'images', 'fonts'];

/**
 * Create dist files and inline <head> css/js
 */
gulp.task('createDistPartials', tasks, function() {
  return gulp
    .src(
      ['layouts/head.twig', 'layouts/foot.twig', 'components/iconfile.twig'],
      { base: './' },
    )
    .pipe(
      $.replace(inline({ matchFile: 'app.css' }), function() {
        return inline({ file: 'app.css' });
      }),
    )
    .pipe(
      $.replace(inline({ matchFile: 'app.head.js' }), function() {
        return inline({ file: 'app.head.js' });
      }),
    )
    .pipe($.rename({ suffix: '.dist' }))
    .pipe(gulp.dest('dist/'));
});

/**
 * Revision and remove unneeded files
 */
gulp.task('rev', tasks.concat(['createDistPartials']), function() {
  rimraf.sync('dist/assets/' + '*.css');
  rimraf.sync('dist/assets/' + 'app.head.js');
  rimraf.sync('dist/assets/' + 'vendors/');

  return gulp
    .src(['dist/assets/*.js', 'dist/assets/{images,fonts}/**'])
    .pipe($.rev())
    .pipe(gulp.dest('dist/assets'))
    .pipe(rmOriginalFiles())
    .pipe($.rev.manifest())
    .pipe(gulp.dest('./'));
});

/**
 * Update references
 */
gulp.task('updateReferences', tasks.concat(['rev']), function() {
  var manifest = gulp.src('./rev-manifest.json');

  return gulp
    .src(
      [
        'dist/assets/**',
        'dist/layouts/head.dist.php',
        'dist/layouts/foot.dist.twig',
        'dist/components/iconfile.dist.twig',
      ],
      { base: 'dist/' },
    )
    .pipe(
      $.revReplace({
        manifest: manifest,
        replaceInExtensions: ['.js', '.css', '.php', '.twig'],
      }),
    )
    .pipe(gulp.dest('dist/'));
});

/* ======
 * Main collected tasks
 * ====== */

gulp.task('build', function() {
  rimraf.sync('dist/');
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
        '<script(.*?)src="(.*?)' + opts.matchFile + '"(.*?)>(.*?)</script>',
      );
    }
    return new RegExp('<link(.*?)href="(.*?)' + opts.matchFile + '"(.*?)>');
  }

  if (opts.file) {
    var content;
    var tagBegin = '<script>';
    var tagEnd = '</script>';

    if (opts.file.match(/.js/)) {
      content = fs.readFileSync('dist/assets/' + opts.file, 'utf8');
    } else {
      tagBegin = '<style>';
      tagEnd = '</style>';
      content = fs.readFileSync('dist/assets/' + opts.file, 'utf8');
    }

    return tagBegin + content + tagEnd;
  }
}

var startTime,
  bundleLogger = {
    start: function(filepath) {
      startTime = process.hrtime();
      $.util.log('Bundling', $.util.colors.green(filepath));
    },
    end: function(filepath) {
      var taskTime = process.hrtime(startTime);
      var prettyTime = prettyHrtime(taskTime);
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
