/* ========================================
 * Gulpfile for `<%= appNameHumanize %>`
 * ========================================
 *
 * @generated <%= (generatorDate) %> using `<%= pkg.name %> v<%= pkg.version %>`
 * @url <%= (generatorRepository) %>
 */

var fs = require('fs')
var browserify = require('browserify')
var browserSync = require('browser-sync').create()
var gulp = require('gulp')
var notifier = require('node-notifier')
var path = require('path')
var prettyHrtime = require('pretty-hrtime')
var rimraf = require('rimraf')
var source = require('vinyl-source-stream')
var through = require('through2')
var watchify = require('watchify')
var $ = require('gulp-load-plugins')()

var production = process.env.NODE_ENV === 'production'
var host = process.env.npm_config_host
var open = process.env.npm_config_disable_open ? false : 'external'


/* ======
 * Config
 * ====== */

var config = {
  ext: 'typo3conf/ext/<%= dir %>/',
  host: '<%= dir %>.dev:8000',
  src: 'Resources/Private/',
  dest: 'Resources/Public/',
  stylesheets: {
    src: 'Assets/app.scss',
    dest: 'Resources/Public/Assets/',
    watch: 'Assets/**/**/*.scss'
  },
  javascripts: {
    src: 'Assets/',
    dest: 'Resources/Public/Assets/',
    bundle: [{
      fileName: 'app.js'
    }, {
      fileName: 'app.head.js'
    }]
  },
  images: {
    src: 'Assets/images/*.{jpg,jpeg,png,gif,webp,svg}',
    dest: 'Resources/Public/Assets/images/',
    watch: 'Assets/images/*.{jpg,jpeg,png,gif,webp,svg}'
  },
  fonts: {
    src: 'Assets/fonts/*.{eot,svg,ttf,woff,woff2}',
    dest: 'Resources/Public/Assets/fonts/',
    watch: 'Assets/fonts/*.{eot,svg,ttf,woff,woff2}'
  }
}


/* ======
 * Tasks
 * ====== */

/**
 * Stylesheets
 */
gulp.task('stylesheets', function() {
  var pipeline = gulp.src(config.stylesheets.src)
    .pipe($.sass({
      includePaths: ['node_modules'],
      outputStyle: 'expanded'
    }))
    .on('error', handleError)
    .on('error', $.sass.logError)
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'IE 10', 'Safari >= 8']
    }))

  if (production) {
    return pipeline = pipeline
      .pipe($.replace('./', '/' + config.ext + config.dest + 'Assets/'))
      .pipe($.combineMq({ beautify: false }))
      .pipe($.cssnano({ mergeRules: false, zindex: false }))
      .pipe(gulp.dest(config.stylesheets.dest))
  } else {
    return pipeline = pipeline
      .pipe(gulp.dest(config.stylesheets.dest))
      .pipe(browserSync.stream())
  }
})

/**
 * Javascripts
 */
gulp.task('javascripts', ['modernizr'], function(callback) {

  var bundleQueue = config.javascripts.bundle.length

  var browserifyBundle = function(bundleConfig) {

    var pipeline = browserify({
      cache: {},
      packageCache: {},
      fullPaths: false,
      entries: config.javascripts.src + bundleConfig.fileName,
      debug: !production
    })

    var bundle = function() {
      bundleLogger.start(bundleConfig.fileName)

      var collect = pipeline
        .bundle()
        .on('error', handleError)
        .pipe(source(bundleConfig.fileName))

      if (!production) {
        collect = collect.pipe(browserSync.stream())
      } else {
        collect = collect.pipe($.streamify($.uglify()))
      }

      return collect
        .pipe(gulp.dest(config.javascripts.dest))
        .on('end', reportFinished)
    }

    if (!production) {
      pipeline = watchify(pipeline).on('update', bundle)
    }

    var reportFinished = function() {
      bundleLogger.end(bundleConfig.fileName)

      if (bundleQueue) {
        bundleQueue--
        if (bundleQueue === 0) {
          callback()
        }
      }
    }

    return bundle()
  }

  config.javascripts.bundle.forEach(browserifyBundle)
})

/**
 * Images
 */
gulp.task('images', function() {
  return gulp.src(config.images.src)
    .pipe($.changed(config.images.dest))
    .pipe($.imagemin({
      svgoPlugins: [
        { cleanupIDs: false },
      ],
    }))
    .on('error', handleError)
    .pipe(gulp.dest(config.images.dest))
})

/**
 * Fonts
 */
gulp.task('fonts', function() {
  return gulp.src(config.fonts.src)
    .pipe($.changed(config.fonts.dest))
    .on('error', handleError)
    .pipe(gulp.dest(config.fonts.dest))
})

/**
 * Server
 */
gulp.task('server', function() {
  browserSync.init({
    open: open,
    port: 9001,
    proxy: host ? host : config.host,
    notify: false,
    serveStatic: ['./']
  })
})

/**
 * Watch
 */
gulp.task('watch', function(callback) {
  gulp.watch(config.src + '**/*.html').on('change', browserSync.reload)
  gulp.watch(config.stylesheets.watch, ['stylesheets'])
  gulp.watch(config.fonts.watch, ['fonts'])
  gulp.watch(config.images.watch, ['images'])
})

/**
 * JavasScript Coding style
 */
gulp.task('eslint', function () {
  return gulp.src(config.javascripts.src + '**/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
})

/**
 * Modernizr
 */
gulp.task('modernizr', ['stylesheets'], function() {
  return gulp.src([
    config.javascripts.src + '**/*.js',
    config.stylesheets.dest + 'app.css'
  ])
    .pipe($.modernizr({
      excludeTests: ['hidden'],
      tests: ['objectfit'],
      options: [
        'setClasses',
        'addTest',
        'html5printshiv',
        'testProp',
        'fnBind',
        'prefixed'
      ]
    }))
    .on('error', handleError)
    .pipe(gulp.dest(config.javascripts.dest + 'vendors'))
})

/**
 * Tasks
 */
var tasks = ['stylesheets', 'javascripts', 'images', 'fonts']

/**
 * Create dist files and inline <head> css/js
 */
gulp.task('createDistPartials', tasks, function() {
  return gulp.src([
    config.src + 'Partials/Top.html',
    config.src + 'Partials/Bottom.html',
  ], { base: config.src })
    .pipe($.replace(inline({ matchFile: 'app.css' }), function() {
      return inline({ file: 'app.css' })
    }))
    .pipe($.replace(inline({ matchFile: 'app.head.js' }), function() {
      return inline({ file: 'app.head.js' })
    }))
    .pipe($.rename({ suffix: '.dist' }))
    .pipe(gulp.dest(config.src))
})

/**
 * Revision
 */
gulp.task('rev', tasks.concat(['createDistPartials']), function() {
  rimraf.sync(config.stylesheets.dest + '*.css')
  rimraf.sync(config.javascripts.dest + 'app.head.js')
  rimraf.sync(config.javascripts.dest + 'vendors/')

  return gulp.src([
    config.dest + 'Assets/*.js',
    config.dest + 'Assets/{images,fonts}/**'
  ])
    .pipe($.rev())
    .pipe(gulp.dest(config.dest + 'Assets/'))
    .pipe(rmOriginalFiles())
    .pipe($.rev.manifest())
    .pipe(gulp.dest('./'))
})

/**
 * Update references
 */
gulp.task('updateReferences', tasks.concat(['rev']), function() {
  var manifest = gulp.src('./rev-manifest.json')

  return gulp.src([
    config.dest + 'Assets/**',
    config.src + 'Partials/Top.dist.html',
    config.src + 'Partials/Bottom.dist.html'
  ], { base: config.dest })
    .pipe($.revReplace({
      manifest: manifest,
      replaceInExtensions: ['.js', '.css', '.html']
    }))
    .pipe(gulp.dest(config.dest))
})


/* ======
 * Main collected tasks
 * ====== */

gulp.task('build', ['eslint'], function() {
  rimraf.sync(config.dest)
  gulp.start(tasks.concat([
    'modernizr',
    'createDistPartials',
    'rev',
    'updateReferences'
  ]))
})

gulp.task('default', ['build'])

gulp.task('dev', tasks.concat([
  'modernizr',
  'watch',
  'server'
]))


/* ======
 * Utilities
 * ====== */

function handleError(err) {
  $.util.log(err)
  $.util.beep()
  notifier.notify({
    title: 'Compile Error',
    message: err.message
  })
  return this.emit('end')
}

function inline(opts) {
  opts = opts || {}

  if (opts.matchFile) {
    if (opts.matchFile.match(/.js/)) {
      return new RegExp('<v:asset.script(.*?)path="(.*?)'+opts.matchFile+'"(.*?)>')
    }
    return new RegExp('<v:asset.style(.*?)path="(.*?)'+opts.matchFile+'"(.*?)>')
  }

  if (opts.file) {
    var content
    var tagBegin = '<v:asset.script standalone="true" movable="false">'
    var tagEnd = '</v:asset.script>'

    if (opts.file.match(/.js/)) {
      content = fs.readFileSync(config.javascripts.dest + opts.file, 'utf8')
    } else {
      tagBegin = '<v:asset.style standalone="true">'
      tagEnd = '</v:asset.style>'
      content = fs.readFileSync(config.stylesheets.dest + opts.file, 'utf8')
    }

    return tagBegin + content + tagEnd
  }
}

var startTime, bundleLogger = {
  start: function(filepath) {
    startTime = process.hrtime()
    $.util.log('Bundling', $.util.colors.green(filepath))
  },
  end: function(filepath) {
    var taskTime = process.hrtime(startTime)
    var prettyTime = prettyHrtime(taskTime)
    $.util.log('Bundled', $.util.colors.green(filepath), 'after', $.util.colors.magenta(prettyTime))
  }
}

function rmOriginalFiles() {
  return through.obj(function(file, enc, cb) {

    if (file.revOrigPath) {
      fs.unlinkSync(file.revOrigPath)
    }

    this.push(file)
    return cb()
  })
}

