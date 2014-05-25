var exec = require('child_process').exec,
	path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		manifest: grunt.file.readJSON('extension/manifest.json'),

		jshint: {
			extension: [
				'Gruntfile.js',
				'extension/scripts/**/*.js'
			]
		},

		clean: ['build'],

		zip: {
			// zip for uploading to Google Web Store Dashboard
			chrome: {
				router: function (filepath) {
					var filename = path.basename(filepath);

					return filename === 'key.pem' ? 'extension/key.pem' : filepath;
				},

				src: ['extension/**', 'key.pem'],
				dest: 'build/chime.zip'
			},
			extension: {
				cwd: 'extension/',
				src: ['extension/**'],
				dest: 'build/extension.zip'
			}
		},

		crx: {
			extension: {
				src: 'build/extension.zip',
				dest: 'build/chime.crx'
			}
		},

		less: {
			extension: {
				options: {
					cleancss: false,
					compress: false
				},
				files: [{
					expand: true,
					src: '**/*.less',
					dest: 'extension/options/css',
					cwd: 'extension/options/less',
					ext: '.css'
				}, {
					expand: true,
					src: '**/*.less',
					dest: 'extension/popup/css',
					cwd: 'extension/popup/less',
					ext: '.css'
				}, {
					expand: true,
					src: '**/*.less',
					dest: 'extension/content/css',
					cwd: 'extension/content/less',
					ext: '.css'
				}]
			}
		},

		watch: {
			less: {
				files: ['extension/*/less/**/*.less'],
				tasks: ['less:extension']
			}
		}
	});

	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-crx');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('check', function () {
		if (grunt.file.exists('key.pem')) {
			grunt.log.ok();
		} else {
			grunt.fail.fatal('File key.pem not found. ');
		}
	});

	grunt.registerTask('build-extension', [
		'jshint',
		'check',
		'zip:extension',
		'crx:extension',
		'zip:chrome']);

	grunt.registerTask('default', ['clean', 'build-extension']);
};
