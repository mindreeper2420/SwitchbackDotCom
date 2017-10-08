var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var header = require('gulp-header');
var rename = require("gulp-rename");
var pkg = require('./package.json');
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');

// Set the banner content
var banner = ['/*!\n',
' * Switchback.com - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
' * Copyright 2008-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
' */\n',
''
].join('');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
  realFavicon.generateFavicon({
    masterPicture: 'img/master_picture.png',
    dest: 'img/',
    iconsPath: 'img/',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#ffffff',
        margin: '14%',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: true,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        }
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#2d89ef',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        }
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'blackAndWhite',
        threshold: 60,
        themeColor: '#66000c'
      }
    },
    settings: {
      compression: 2,
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    versioning: {
      paramName: 'v',
      paramValue: 'kPx9Kz5w54'
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
  return gulp.src([ '_includes/head.html' ])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest('_includes/'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });
});

gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');

  return gulp
    .src('_sass/*.scss')
    .pipe(gulpStylelint({
      failAfterError: false,
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});

gulp.task('sass', ['lint-css'], function() {
  return gulp.src("_sass/*.scss")
  .pipe(sass().on('error', sass.logError))
  .pipe(header(banner, { pkg: pkg }))
  .pipe(rename({ suffix: '.min' })) 
  .pipe(gulp.dest('css'));
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copyLibraries', function() {
  gulp.src(['node_modules/bootstrap/scss/**'])
  .pipe(gulp.dest('_sass/vendor/bootstrap'))

  gulp.src([
    'node_modules/font-awesome/scss/**',
    '!node_modules/font-awesome/**/*.map',
    '!node_modules/font-awesome/.npmignore',
    '!node_modules/font-awesome/*.txt',
    '!node_modules/font-awesome/*.md',
    '!node_modules/font-awesome/*.json'
  ])
  .pipe(gulp.dest('_sass/vendor/font-awesome'))

  gulp.src(['node_modules/font-awesome/fonts/**'])
  .pipe(gulp.dest('fonts'))
})

gulp.task('cleanVendors', function() {
    return del([
        '_sass/vendor',
        'js/vendor',
        'fonts/**'
    ]);
});

gulp.task('cleanModules', function() {
    return del([
        'node_modules'
    ]);
});

gulp.task('initialize', ['generate-favicon', 'inject-favicon-markups', 'copy', 'sass']);

gulp.task('copy', ['copyLibraries']);

// Run everything
gulp.task('default', ['copy',]);
