'use strict';

let gulp = require('gulp');
let bump = require('gulp-bump');
let argv = require('yargs').argv;

function process(src, dest) {
	return gulp.src(src)
		.pipe(bump({
			type: argv.type || 'minor'
		}))
		.pipe(gulp.dest(dest));
}

gulp.task('bump', () => {
	process('bower.json', '.');
	process('package.json', '.');
	process('extension/manifest.json', 'extension');
});
