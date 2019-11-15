// Include gulp
import gulp from 'gulp';

// Include plugins
import gutil from 'gulp-util';
import del from 'del';
import nodemon from 'gulp-nodemon';
import concat from 'gulp-concat';
import less from 'gulp-less';
import minifycss from 'gulp-cssnano';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import smaps from 'gulp-sourcemaps';
import cache from 'gulp-cached';    // for future use


// Check if Production
let isProduction = true;
let sourceMap = false;
if (gutil.env.dev === true) {
    isProduction = false;
    sourceMap = true;
}

// Clean Task
gulp.task('clean', () => {
    return del([
        // Everything inside dist folder
        'dist/*'
    ]);
});

// Compile Less
gulp.task('less', () => {
    return gulp
        .src('./src/css/app.less')
        .pipe(sourceMap ? smaps.init() : gutil.noop())
        .pipe(less())
        .pipe(isProduction ? minifycss() : gutil.noop())
        .pipe(sourceMap ? smaps.write('.') : gutil.noop())
        .pipe(gulp.dest('./dist/css'));
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
        .pipe(gulp.dest('./dist/js'));
});

// Concatenate & Minify Server JS
gulp.task('scripts-server', () => {
    return gulp
        .src('./src/server/*.js')
        .pipe(
            babel({
                presets: ['@babel/env']
            })
        )
        .pipe(concat('server.js'))
        .pipe(isProduction ? uglify() : gutil.noop())
        .pipe(gulp.dest('./dist'));
});

// Build
gulp.task('build', gulp.series('clean', gulp.parallel('less', 'scripts', 'scripts-server')));

// Watch files for changes
gulp.task('watch', () => {
    gulp.watch('./src/css/*.less', gulp.series('less'));
    gulp.watch('./src/js/*.js', gulp.parallel('scripts'));
    gulp.watch('./src/server/*.js', gulp.parallel('scripts-server'));
});

// Nodemon
gulp.task(
    'nodemon',
    gulp.series(
        'build',
        gulp.parallel('watch', () => {
            nodemon({
                script: './dist/server.js',
                env: { NODE_ENV: 'development' },
                ext: 'js pug',
                tasks: ['lint'],
                watch: ['./dist/js', './dist/server.js']
            });
        })
    )
);

// Default task
// gulp.task('default', gulp.series('nodemon'));
