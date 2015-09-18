var gulp = require('gulp'),
	zip = require('gulp-zip');

gulp.task('zip', function () {
	return gulp.src([
		'extension/*'
	], { base: 'extension/' })
		.pipe(zip('chime.zip'))
		.pipe(gulp.dest('build'));
});
