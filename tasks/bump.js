var gulp = require('gulp'),
	bump = require('gulp-bump'),
	argv = require('yargs').argv;

gulp.task('bump', function () {
	return gulp.src(['bower.json', 'package.json', 'extension/manifest.json'])
		.pipe(tasks.bump({
			type: argv.type || 'minor'
		}))
		.pipe(gulp.dest('.'));
});