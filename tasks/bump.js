var gulp = require('gulp'),
	bump = require('gulp-bump'),
	argv = require('yargs').argv;

function process(src, dest) {
	return gulp.src(src)
		.pipe(bump({
			type: argv.type || 'minor'
		}))
		.pipe(gulp.dest(dest));
}

gulp.task('bump', function () {
	process('bower.json', '.');
	process('package.json', '.');
	process('extension/manifest.json', 'extension');
});