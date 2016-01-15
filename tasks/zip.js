var gulp = require('gulp'),
	merge = require('merge2'),
	zip = require('gulp-zip');

gulp.task('zip', function () {
	return merge(
		gulp.src('extension/**/*', { base: 'extension/' }),
		gulp.src('key.pem')
	)
		.pipe(zip('chime.zip'))
		.pipe(gulp.dest('build'));
});
