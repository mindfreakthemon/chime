require.config({
	baseUrl: chrome.extension.getURL('/js/player'),
	paths: {
		jade: '../../vendor/jade/js/runtime',
		md5: '../../vendor/blueimp-md5/js/md5.min',
		settings: '../misc/settings',
		lastfm: '../misc/lastfm',
		loader: '../misc/loader',
		templates: '../templates/options'
	},
	deps: [
		'resizer',
		'requester',
		'loader!required:controls'
	]
});
