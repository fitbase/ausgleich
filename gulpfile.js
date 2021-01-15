'use strict';

const {gulp, src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');


// Sass compiler
sass.compiler = require('node-sass');

const paths = {
    dist: `./dist`,
    src: `./src`,
};

function clean() {
    return del( `${paths.dist}/**`, {force:true});
}

function styles() {
    return src(`${paths.src}/sass/styles.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed', noCache: true}).on('error', sass.logError))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest(`${paths.dist}/css/`))
        .pipe(browserSync.stream());
}

// HTML compiler
function fileInclude() {
    return src([`${paths.src}/templates/**/*.html`])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest(`${paths.dist}`));
}

// Images handler
function images() {
    return src(`${paths.src}/img/**/*`)
        .pipe(newer(`${paths.dist}/img/`))
        .pipe(imagemin())
        .pipe(dest(`${paths.dist}/img/`))
}

// Watch
function startwatch() {
    watch(`${paths.src}/sass/**/*`, series(styles, reload));
    watch([`${paths.src}/chunks/**/*.html`, `${paths.src}/templates/**/*.html`], fileInclude);
    watch(`${paths.src}/img/**/*`, images);

    watch(`${paths.src}/sass/**/*.scss`).on('change', browserSync.reload);
    watch([`${paths.src}/chunks/**/*.html`, `${paths.src}/templates/**/*.html`]).on('change', browserSync.reload);
    watch(`${paths.src}/img/**/*`).on('change', browserSync.reload);
}

// browserSync
function browsersync() {
    browserSync.init({
        server: {
            baseDir: `${paths.dist}`
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
exports.build = series(clean, styles, fileInclude, images);
exports.clean = clean;


