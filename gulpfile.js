// npm install gulp gulp-mocha

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');


gulp.task('mocha', function() {
    return gulp.src(['test/common.js', 'src/**/*.test.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec'
        }))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['src/**/*.js', 'test/*'], ['mocha']);
});

gulp.task('lint', function () {
    gulp.src('./**/*.js')
        .pipe(jshint());
});

gulp.task('develop', function () {
    nodemon({
        script: 'src/InsteonProxy.js',
        ext: 'html js',
        ignore: 'src/**/*.test.js'
    })
//        .on('change', ['lint'])
        .on('restart', function () {
            console.log('restarted!')
        });
});