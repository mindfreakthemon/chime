require.load = function (context, moduleName, url) {
	var xhr = new XMLHttpRequest();

	xhr.onload = function () {
		/* jshint evil:true */
		eval(xhr.responseText);
		context.completeLoad(moduleName);
	};

	xhr.open('GET', url, true);
	xhr.send(null);
};

require.config({
	baseUrl: chrome.extension.getURL('/js/content'),
	skipDataMain: true,
	paths: {
		jade: '../../vendor/jade/runtime',
		md5: '../../vendor/blueimp-md5/js/md5.min',
		settings: '../misc/settings',
		lastfm: '../lastfm/api',
		'lastfm-core': '../lastfm/core',
		loader: '../misc/loader'
		//templates: '../templates/content'
	},
	deps: [
		'receiver',
		'sender',
		'options',
		'loader!optional:modifications/hero:hero_hidden',
		'loader!optional:theme/theme:theme_enabled',
		'loader!optional:lyrics/lyrics:lyrics_loaded',
		'loader!optional:scrobbling/scrobbling:scrobbling_loaded',
		'loader!optional:notifications/notifications:notify_loaded'
	]
});
