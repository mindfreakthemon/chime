var gulp = require('gulp'),
	jshint = require('gulp-jshint');

gulp.task('lint', function () {
	return gulp.src([
			'gulpfile.js',
			'src/js/**/*.js',
			'tasks/**/*.js'
		])
		.pipe(jshint({
			linter: 'jshint-esnext',
			esnext: 7,
			experimental: ['asyncawait']
		}))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});
