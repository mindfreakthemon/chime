require.config({
	baseUrl: chrome.extension.getURL('/js/options'),
	paths: {
		jade: '../../vendor/jade/js/runtime',
		md5: '../../vendor/blueimp-md5/js/md5.min',
		settings: '../misc/settings',
		lastfm: '../lastfm/api',
		'lastfm-core': '../lastfm/core',
		loader: '../misc/loader',
		templates: '../templates/options'
	},
	deps: [
		'navigation',
		'modals',
		'loader!required:form',
		'loader!required:scrobbling',
		'loader!required:lyrics'
	]
});
