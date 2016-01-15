System.config({
	baseURL: chrome.extension.getURL('/js'),
	map: {
		css: chrome.extension.getURL('/js/misc/system.css.raw.js'),
		jade: chrome.extension.getURL('/vendor/jade/runtime.js'),
		md5: chrome.extension.getURL('/vendor/blueimp-md5/js/md5.min.js')
	},
	paths: {
		'styles/*': chrome.extension.getURL('/styles/*')
	},
	packages: {
		'content/lyrics': {
			main: 'index.js'
		},
		'content/scrobbling': {
			main: 'index.js'
		},
		'content/notifications': {
			main: 'index.js'
		},
		'content/hero': {
			main: 'index.js'
		},
		'content/theme': {
			main: 'index.js'
		},
		'content/transmitter': {
			main: 'index.js'
		}
	}
});
