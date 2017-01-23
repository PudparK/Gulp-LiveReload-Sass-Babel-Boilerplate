"use strict";

// Import dependencies.
import gulp from "gulp";
import connect from "gulp-connect";
import watch from "gulp-watch";
import sass from "gulp-sass";
import imagemin from "gulp-imagemin";
import cache from "gulp-cache";
import browserify from "browserify";
import source from "vinyl-source-stream";

// Browser Sync
const browserSync = require("browser-sync").create();

// Sources
const JS_SOURCES = ['app/js/*.js'];
const HTML_SOURCES = ['app/*.html']
const SASS_SOURCES = ['app/sass/**/*.sass']


//////////// Tasks ////////////

// Watch

gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch(JS_SOURCES, ['babel']);
    gulp.watch(HTML_SOURCES, browserSync.reload);
    gulp.watch(SASS_SOURCES, ['sass']);
});

// Babel
gulp.task('babel', () => {
    return browserify("app/js/app.js")
    .transform("babelify")
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("app/js"))
    .pipe(browserSync.reload({
        stream: true
    }));
});

// Sass
gulp.task('sass', () => {
    return gulp.src(SASS_SOURCES)
    .pipe(sass({outputStyle: 'compact', indentedSyntax: true, sourceComments: true}).on('error', sass.logError))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

// BrowserSync
gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    });
});

// Imagemin
gulp.task('images', () => {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

// Default Task
gulp.task("default", ['babel', 'watch', 'sass']);


// Left off on https://css-tricks.com/gulp-for-beginners/#article-header-id-12