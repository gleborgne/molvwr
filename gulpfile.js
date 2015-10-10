var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var del = require('del');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var flatten = require('gulp-flatten');
var merge = require('merge-stream');
var bom = require('gulp-bom');
var webserver = require('gulp-webserver');

var onError = function(err) {
	//notify.onError({
	//	title:    "Gulp",
	//	subtitle: "Failure!",
	//	message:  "Error: <%= error.message %>",
	//	sound:    "Beep"
	//})(err);

	this.emit('end');
};


gulp.task('clean', function(cb) {
	del(['website/molvwr'], cb)
});

gulp.task('styles', function() {
	return gulp.src(['**/*.less'], { cwd: 'demo website',  base : '.' })
	.pipe(plumber({errorHandler: onError}))
	.pipe(less())
	.pipe(bom())
	.pipe(gulp.dest(''));	
});

var tsMolvwrProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: true,
    target: 'ES5',
    noEmitOnError: false
});

gulp.task('compile-molvwr', function () {
	var tsResult = gulp.src([
		'src/**/*.ts',
    ], { base: '.' })
	.pipe(plumber({ errorHandler: onError }))
	//.pipe(sourcemaps.init())
	.pipe(ts(tsMolvwrProject));

    return merge([
        tsResult.dts.pipe(flatten()).pipe(concat('molvwr.d.ts')).pipe(bom()).pipe(gulp.dest('website/molvwr')),
        tsResult.js
            .pipe(concat('molvwr.js'))
        	//.pipe(sourcemaps.write(".",{
        	//    sourceRoot: function (file) {
        	//        var sources = [];
        	//        file.sourceMap.sources.forEach(function (s) {
        	//            var filename = s.substr(s.lastIndexOf('/') + 1);
        	//            //console.log(filename)
        	//            sources.push("../../src/" + [filename]);
        	//        });
        	//        file.sourceMap.sources = sources;
            //        return ' ';
            //    }
            //}))
            .pipe(bom())
        	.pipe(gulp.dest('demo website/molvwr'))
    ]);
});

gulp.task('webserver', function() {
  gulp.src('demo website')
    .pipe(webserver({
      livereload: true,
      open: 'http://localhost:1338/index.html',
      port: 1338,
      fallback: 'index.html'
    }));
});

gulp.task('build', ['clean', 'compile-molvwr'], function () {
});

gulp.task('watch', function() {
	gulp.start('webserver');
    gulp.watch(['demo website/**/*.less'], ['styles']);
    gulp.watch(['src/**/*.ts'], ['compile-molvwr']);
});

gulp.task('default', ['build'], function() {
});