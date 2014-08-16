require.config({
	baseUrl: chrome.extension.getURL('/js/options'),
	paths: {
		jade: '../../vendor/jade/js/runtime',
		md5: '../../vendor/blueimp-md5/js/md5.min',
		settings: '../misc/settings',
		lastfm: '../misc/lastfm',
		loader: '../misc/loader',
		templates: '../templates/options'
	},
	deps: [
		'form',
		'navigation',
		'loader!required:scrobbling',
		'loader!required:lyrics'
	]
});
