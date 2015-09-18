var gulp = require('gulp'),
	ChromeExtension = require('crx'),
	fs = require('fs'),
	crx = new ChromeExtension({
		privateKey: fs.readFileSync('extension/key.pem')
	});

gulp.task('crx', ['zip'], function () {
	crx.load('extension')
		.then(function () {
			return crx.pack().then(function (crxBuffer) {
				fs.writeFile('build/chime.crx', crxBuffer);
			});
		});
});