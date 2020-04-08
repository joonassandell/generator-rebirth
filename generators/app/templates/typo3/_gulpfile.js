/* =======================================
 * Gulpfile
 * ======================================= */

const browserify = require('browserify');
const browserSync = require('browser-sync').create();
const color = require('ansi-colors');
const cssnano = require('cssnano');
const fs = require('fs');
const gulp = require('gulp');
const log = require('fancy-log');
const notifier = require('node-notifier');
const path = require('path');
const postcss = require('gulp-postcss');
const prettyHrtime = require('pretty-hrtime');
const rimraf = require('rimraf');
const source = require('vinyl-source-stream');
const through = require('through2');
const uglify = require('gulp-uglify-es').default;
const watchify = require('watchify');
const $ = require('gulp-load-plugins')();

const PRODUCTION = process.env.NODE_ENV === 'production';

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
    .on('error', $.sass.logError)
    .pipe($.autoprefixer());

  if (PRODUCTION) {
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
        postcss([
          cssnano({
            mergeRules: false,
            zindex: false,
            discardComments: { removeAll: true },
          }),
        ]),
      )
      .pipe(gulp.dest('Resources/Public/Assets/')));
  } else {
    return (pipeline = pipeline
      .pipe(gulp.dest('Resources/Public/Assets/'))
      .pipe(browserSync.stream()));
  }
});

/**
 * JavaScripts
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

  const browserifyBundle = (entry) => {
    let pipeline = browserify({
      entries: `Assets/${entry.fileName}`,
      debug: !PRODUCTION,
      paths: ['Assets'],
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
        .pipe(gulp.dest('Resources/Public/Assets/'))
        .on('end', reportFinished);
    };

    if (!PRODUCTION && process.env.ENABLE_WATCH) {
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
 * Watch files
 */
gulp.task('watch-files', function() {
  gulp
    .watch('Resources/Private/' + '**/*.html')
    .on('change', browserSync.reload);
  gulp.watch('Assets/**/**/*.scss', gulp.series('stylesheets'));
  gulp.watch('Assets/fonts/*.{eot,svg,ttf,woff,woff2}', gulp.series('fonts'));
  gulp.watch(
    'Assets/images/*.{jpg,jpeg,png,gif,webp,svg}',
    gulp.series('images'),
  );
});

/**
 * Create build files and inline <head> css/js
 */
gulp.task('createBuildPartials', function() {
  return gulp
    .src(
      [
        'Resources/Private/Partials/Head.html',
        'Resources/Private/Partials/Foot.html',
      ],
      { base: 'Resources/Private/' },
    )
    .pipe($.replace(findFile('index.css'), () => inlineFile('index.css')))
    .pipe($.replace(findFile('head.js'), () => inlineFile('head.js')))
    .pipe($.rename({ suffix: '.dist' }))
    .pipe(gulp.dest('Resources/Private/'));
});

/**
 * Revision and remove unneeded files
 */
gulp.task('rev', function() {
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
      $.rename((path) => {
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
gulp.task('updateReferences', function() {
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

gulp.task('clean', function(cb) {
  rimraf.sync('Resources/Public/Assets');
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
      'watch-files',
      'server',
    ),
  ),
);

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
    const content = fs.readFileSync(`Resources/Public/Assets/${file}`, 'utf8');
    return `<v:asset.script standalone="true" movable="false">${content}</v:asset.script>`;
  } else {
    const content = fs.readFileSync(`Resources/Public/Assets/${file}`, 'utf8');
    return `<v:asset.style standalone="true">${content}</v:asset.style>`;
  }
}

function findFile(file) {
  if (file.match(/.js/)) {
    return new RegExp('<v:asset.script(.*?)path="(.*?)' + file + '"(.*?)>');
  }
  return new RegExp('<v:asset.style(.*?)path="(.*?)' + file + '"(.*?)>');
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
