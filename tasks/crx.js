var gulp = require('gulp'),
	ChromeExtension = require('crx'),
	fs = require('fs');

gulp.task('crx', ['zip'], function () {
	var crx = new ChromeExtension({
		privateKey: fs.readFileSync('key.pem')
	});

	crx.load('extension')
		.then(function () {
			return crx.pack().then(function (crxBuffer) {
				fs.writeFile('build/chime.crx', crxBuffer);
			});
		});
});