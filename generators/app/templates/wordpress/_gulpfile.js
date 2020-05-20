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
    .src(['assets/index.scss', 'assets/stylesheets/vendors/gutenberg.scss'])
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
            'wp-content/themes/',
            config.theme,
            '/build/assets/',
          ),
        ),
      )
      .pipe(
        $.postcss([
          cssnano({
            autoprefixer: false,
            mergeRules: false,
          }),
          require('postcss-discard-comments')({ removeAll: true }),
          require('postcss-sort-media-queries')(),
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
      entries: `assets/${entry.fileName}`,
      debug: !PRODUCTION,
      paths: ['assets'],
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

      return collect.pipe(gulp.dest('build/assets/')).on('end', reportFinished);
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
    .src('assets/images/*.{jpg,jpeg,png,gif,webp}')
    .pipe($.changed('build/assets/images/'))
    .on('error', handleError)
    .pipe(gulp.dest('build/assets/images/'));
});

gulp.task('images:icon-svg', function() {
  return gulp
    .src('assets/images/*.svg')
    .pipe(
      $.imagemin([
        $.imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
        }),
      ]),
    )
    .pipe(
      $.svgSymbols({
        id: 'Icon--%f',
        class: '.Icon--%f',
        title: `%f icon`,
        slug: (name) => name,
        templates: ['default-svg'],
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
 * Watch files
 */
gulp.task('watch:files', function() {
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
    .pipe($.replace(findFile('index.css'), () => inlineFile('index.css')))
    .pipe($.replace(findFile('head.js'), () => inlineFile('head.js')))
    .pipe(gulp.dest('build/'));
});

/**
 * Revision and remove unneeded files
 */
gulp.task('rev', function() {
  rimraf.sync('build/assets/*.css');
  rimraf.sync('build/assets/head.js');
  rimraf.sync('build/assets/images/svg-symbols.scss');

  return gulp
    .src(['build/assets/*.js', 'build/assets/{images,fonts}/**'])
    .pipe($.rev())
    .pipe(
      $.rename((path) => {
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
    gulp.parallel(
      'stylesheets',
      'javascripts',
      'images',
      'images:icon-svg',
      'fonts',
    ),
    'createBuildPartials',
    'rev',
    'updateReferences',
  ),
);

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel(
      'stylesheets',
      'javascripts',
      'images',
      'images:icon-svg',
      'fonts',
    ),
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
      'images:icon-svg',
      'fonts',
      'watch:files',
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
