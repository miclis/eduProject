// Include gulp
import gulp from 'gulp';

// Include plugins
import gutil from 'gulp-util';
import del from 'del';
import nodemon from 'gulp-nodemon';
import concat from 'gulp-concat';
import sass from 'gulp-sass';
import minifycss from 'gulp-cssnano';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import smaps from 'gulp-sourcemaps';
import cache from 'gulp-cached';

// Check if Production
let isProduction = true;
let sourceMap = false;
if (gutil.env.dev === true) {
    isProduction = false;
    sourceMap = true;
}

// Clean Task
gulp.task('clean', () => {
    return del(['build/*', 'public/css/*', 'public/js/*']);
});

// Compile Sass
gulp.task('sass', () => {
    return gulp
        .src('./src/scss/app.scss')
        .pipe(sourceMap ? smaps.init() : gutil.noop())
        .pipe(sass())
        .pipe(isProduction ? minifycss() : gutil.noop())
        .pipe(sourceMap ? smaps.write('.') : gutil.noop())
        .pipe(gulp.dest('./public/css'));
});

// Copy Pug Templates to build
gulp.task('pug', () => {
    return gulp
        .src('./src/server/views/**/*.pug')
        .pipe(cache('pug'))
        .pipe(gulp.dest('./build/views'));
});

// Concatenate & Minify JS
gulp.task('scripts', () => {
    return gulp
        .src('./src/js/*.js')
        .pipe(sourceMap ? smaps.init() : gutil.noop())
        .pipe(
            babel({
                presets: ['@babel/env']
            })
        )
        .pipe(concat('all.js'))
        .pipe(isProduction ? uglify() : gutil.noop())
        .pipe(sourceMap ? smaps.write('.') : gutil.noop())
        .pipe(gulp.dest('./public/js'));
});

// Transpile Server JS
gulp.task('server-babel', () => {
    return gulp
        .src('./src/server/**/*.js')
        .pipe(cache('build'))
        .pipe(
            babel({
                presets: ['@babel/env']
            })
        )
        .pipe(gulp.dest('./build'));
});

// Build
gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'pug', 'scripts', 'server-babel')));

// Watch files for changes
gulp.task('watch', () => {
    gulp.watch('./src/scss/*.scss', gulp.series('sass'));
    gulp.watch('./src/server/views/**/*.pug', gulp.series('pug'));
    gulp.watch('./src/js/*.js', gulp.parallel('scripts'));
    gulp.watch('./src/server/**/*.js', gulp.parallel('server-babel'));
});

// Nodemon
gulp.task(
    'nodemon',
    gulp.series(
        'build',
        gulp.parallel('watch', () => {
            nodemon({
                script: './build/server.js',
                env: { NODE_ENV: 'development' },
                exec: !isProduction ? "@powershell $env:DEBUG='edu:*'; node" : 'node',
                ext: 'js pug',
                tasks: ['lint'],
                watch: ['./public/js', './build/*']
            });
        })
    )
);

// Default task
gulp.task('default', gulp.series('nodemon'));
