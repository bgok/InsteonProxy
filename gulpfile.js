// npm install gulp gulp-mocha

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var bower = require('gulp-bower');
var karma = require('karma').server;

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('lib/'))
});

gulp.task('mocha', function () {
    return gulp.src(['test/common.js', 'src/Server/**/*.test.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec'
        }))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function () {
    gulp.watch(['src/Server/**/*.js', 'test/*'], ['mocha']);
});

gulp.task('lint', function () {
    gulp.src('./**/*.js')
        .pipe(jshint());
});

gulp.task('develop', function () {
    nodemon({
        script: 'src/Server/InsteonProxy.js',
        ext: 'html js',
        ignore: 'src/**/*.test.js'
    })
//        .on('change', ['lint'])
        .on('restart', function () {
            console.log('restarted!')
        });
});

gulp.task('karma', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});

gulp.task('karma-debug', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false,
        browsers: ['Chrome']
    }, done);
});