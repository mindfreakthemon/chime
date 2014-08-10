require.config({
	baseUrl: chrome.extension.getURL('/js/options'),
	paths: {
		jade: '../../vendor/require-jade/jade',
		md5: '../../vendor/blueimp-md5/js/md5.min',
		settings: '../misc/settings',
		lastfm: '../misc/lastfm'
	},
	deps: [
		'navigation',
		'scrobbling'
	]
});
