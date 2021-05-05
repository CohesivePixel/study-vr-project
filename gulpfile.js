/**
 * Created by Ben on 29-11-2016.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browserSync', function() {
    browserSync.init({server: {baseDir: 'app'}})
});

gulp.task('useref', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpeg|jpg|gif|svg)')
        .pipe(imagemin(cache({interlaced: true})))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('models', function () {
    return gulp.src('app/models/**/*')
        .pipe(gulp.dest('dist/models'))
});

gulp.task('sound', function () {
    return gulp.src('app/sound/**/*')
        .pipe(gulp.dest('dist/sounds'))
});

gulp.task('clean:dist', function(){
    return del.sync('dist');
});

gulp.task('cache:clear', function(callback){
    return cache.clearAll(callback)
});

gulp.task('build', function(callback){
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts', 'models', 'sound'],
        callback
    )
});

gulp.task('watch', ['browserSync', 'sass'], function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('default', function(callback) {
    runSequence(['sass', 'browserSync', 'watch'], callback)
});