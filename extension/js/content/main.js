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
		jade: '../../vendor/jade/js/runtime',
		md5: '../../vendor/blueimp-md5/js/md5.min',
		settings: '../misc/settings',
		lastfm: '../misc/lastfm',
		loader: '../misc/loader',
		templates: '../templates/content'
	},
	deps: [
		'observer',
		'receiver',
		'loader!optional:theme/theme:theme_enabled',
		'loader!optional:lyrics/lyrics:lyrics_enabled',
		'loader!optional:scrobbling:scrobbling_enabled',
		'loader!optional:notifications:notify_enabled',
		'loader!optional:external:player_enabled'
	]
});
