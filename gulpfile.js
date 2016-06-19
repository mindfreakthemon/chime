'use strict';

let gulp = require('gulp');

require('require-dir')('./tasks');

gulp.task('assets', ['bower', 'tpl', 'jade', 'babel', 'stylus']);

gulp.task('default', ['assets'], () => {
	gulp.watch(['src/templates/**/*.jade', 'src/includes/**/*.jade'], ['tpl']);
	gulp.watch(['src/pages/**/*.jade', 'src/includes/**/*.jade'], ['jade']);
	gulp.watch(['src/styles/**/*.styl'], ['stylus']);
	gulp.watch(['src/js/**/*.js'], ['babel']);
});

