require.load = function (context, moduleName, url) {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', url, true);

	xhr.onreadystatechange = function (e) {
		if (xhr.readyState === 4 && xhr.status === 200) {
			/* jshint evil:true */
			eval(xhr.responseText);
			context.completeLoad(moduleName);
		}
	};

	xhr.send(null);
};

require.config({
	baseUrl: chrome.extension.getURL('/js/content'),
	skipDataMain: true,
	paths: {
		jade: '../../vendor/require-jade/js/jade',
		md5: '../../vendor/blueimp-md5/js/md5.min',
		settings: '../misc/settings',
		lastfm: '../misc/lastfm',
		loader: '../misc/loader'
	},
	deps: [
		'observer',
		'search',
		'loader!lyrics_enabled:lyrics',
		'loader!scrobbling_enabled:scrobbling',
		'loader!notify_enabled:notifications'
	]
});
