var gulp = require('gulp'),
	jshint = require('gulp-jshint');

gulp.task('lint', function () {
	return gulp.src([
		'gulpfile.js',
		'extension/js/**/*.js',
		'!extension/js/templates/**'
	])
		.pipe(jshint({}))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});
