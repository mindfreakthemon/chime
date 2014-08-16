var exec = require('child_process').exec,
	path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		manifest: grunt.file.readJSON('extension/manifest.json'),

		jshint: {
			extension: [
				'Gruntfile.js',
				'extension/js/**/*.js',
				'!extension/js/templates/**'
			]
		},

		clean: {
			build: ['build'],
			assets: [
				'extension/pages',
				'extension/styles',
				'extension/vendor'
			]
		},

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
				dest: 'build/chime.crx.zip'
			}
		},

		crx: {
			extension: {
				src: 'build/chime.crx.zip',
				dest: 'build/chime.crx'
			}
		},

		stylus: {
			styles: {
				files: [{
					expand: true,
					src: '**/*.styl',
					dest: 'extension/styles',
					cwd: 'src/styles',
					ext: '.css'
				}]
			}
		},

		jade: {
			pages: {
				files: [{
					expand: true,
					src: '**/*.jade',
					dest: 'extension/pages',
					cwd: 'src/pages',
					ext: '.html'
				}]
			},

			templates: {
				files: {
					'extension/js/templates/options.js': ['src/templates/options/**/*.jade'],
					'extension/js/templates/content.js': ['src/templates/content/**/*.jade']
				},
				options: {
					client: true,
					amd: true,
					processName: function (name) {
						return path.basename(name, '.jade');
					}
				}
			}
		},

		watch: {
			stylus: {
				files: ['src/styles/**/*.styl'],
				tasks: ['stylus:styles'],
				options: {
					atBegin: true
				}
			},

			pages: {
				files: ['src/pages/**/*.jade', 'src/includes/**/*.jade'],
				tasks: ['jade:pages'],
				options: {
					atBegin: true
				}
			},

			templates: {
				files: ['src/templates/**/*.jade'],
				tasks: ['jade:templates'],
				options: {
					atBegin: true
				}
			}
		},

		bower: {
			install: {
				options: {
					targetDir: './extension/vendor/',
					layout: 'byComponent',
					install: true,
					cleanup: true,
					bowerOptions: {}
				}
			}
		},

		concurrent: {
			watch: {
				tasks: ['watch:stylus', 'watch:pages', 'watch:templates'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		bump: {
			options: {
				files: [
					'package.json',
					'bower.json',
					'extension/manifest.json'
				],
				pushTo: 'origin',
				commitFiles: ['-a']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-crx');

	grunt.registerTask('check', function () {
		if (grunt.file.exists('key.pem')) {
			grunt.log.ok();
		} else {
			grunt.fail.fatal('File key.pem not found. ');
		}
	});

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('assets', ['clean:assets', 'bower:install', 'jade:pages', 'jade:templates', 'stylus:styles']);
	grunt.registerTask('prepare', ['clean:build', 'check', 'assets', 'test']);

	grunt.registerTask('crx-extension', ['prepare', 'zip:extension', 'crx:extension']);
	grunt.registerTask('chrome-extension', ['prepare', 'zip:chrome']);

	grunt.registerTask('default', ['chrome-extension']);
};
