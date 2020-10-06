'use strict';

const {gulp, src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');


// Sass compiler
sass.compiler = require('node-sass');

function styles() {
    return src('./src/sass/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed', noCache: true}).on('error', sass.logError))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest('./dist/css/'))
        .pipe(browserSync.stream());
}

// HTML compiler
function fileInclude() {
    return src(['src/templates/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('./dist'));
}

// Images handler
function images() {
    return src('./src/img/**/*')
        .pipe(newer('./dist/img/'))
        .pipe(imagemin())
        .pipe(dest('./dist/img/'))
}

// Watch
function startwatch() {
    watch('./src/sass/**/*', series(styles, reload));
    watch(['./src/chunks/**/*.html', './src/templates/**/*.html'], fileInclude);
    watch('./src/img/**/*', images);

    watch('./src/sass/**/*.scss').on('change', browserSync.reload);
    watch(['./src/chunks/**/*.html', './src/templates/**/*.html']).on('change', browserSync.reload);
    watch('./src/img/**/*').on('change', browserSync.reload);
}

// browserSync
function browsersync() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        port: 3000,
        open: true,
        notify: false
    });
}

function reload(done) {
    browserSync.reload();
    done();
}



exports.sass = styles;
exports.fileInclude = fileInclude;
exports.browsersync = browsersync;
exports.default = parallel(styles, fileInclude, images, browsersync, startwatch);

