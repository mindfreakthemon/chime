System.config({
	baseURL: chrome.extension.getURL('/js'),
	map: {
		css: chrome.extension.getURL('/js/misc/system.css.js'),
		jade: chrome.extension.getURL('/vendor/jade/runtime.js'),
		md5: chrome.extension.getURL('/vendor/blueimp-md5/js/md5.min.js')
	},
	paths: {
		'styles/*': chrome.extension.getURL('/styles/*')
	},
	packages: {
		'background': {
			defaultExtension: 'js'
		},
		'content': {
			defaultExtension: 'js'
		},
		'utils': {
			defaultExtension: 'js'
		},
		'lastfm': {
			defaultExtension: 'js'
		},
		'templates': {
			defaultExtension: 'js'
		},
		'options': {
			defaultExtension: 'js'
		},
		'content/lyrics': {
			main: 'index.js',
		},
		'content/scrobbling': {
			main: 'index.js',
			defaultExtension: 'js'
		},
		'content/notifications': {
			main: 'index.js',
			defaultExtension: 'js'
		},
		'content/hero': {
			main: 'index.js',
			defaultExtension: 'js'
		},
		'content/theme': {
			main: 'index.js',
			defaultExtension: 'js'
		},
		'content/transmitter': {
			main: 'index.js',
			defaultExtension: 'js'
		}
	}
});
