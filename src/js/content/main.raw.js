System.config({
	baseURL: chrome.extension.getURL('/js/content'),
	map: {
		css: chrome.extension.getURL('/js/misc/system.css.raw.js')
	},
	paths: {
		'settings.js': chrome.extension.getURL('/js/misc/settings.js'),
		jade: chrome.extension.getURL('/vendor/jade/runtime.js'),
		md5: chrome.extension.getURL('/vendor/blueimp-md5/js/md5.min.js'),
		'lastfm.js': chrome.extension.getURL('/js/lastfm/api.js'),
		'lastfm/core.js': chrome.extension.getURL('/js/lastfm/core.js'),
		'styles/*': chrome.extension.getURL('/styles/*'),
		'templates-root': chrome.extension.getURL('/js/templates/content.js'),
		'templates.js': chrome.extension.getURL('/js/misc/templates.js')
	}
});

System.import('receiver.js');
System.import('sender.js');
System.import('options.js');
System.import('player/logger.js');
System.import('scrobbling/scrobbling.js');
System.import('lyrics/lyrics.js');
System.import('notifications/notifications.js');
System.import('modifications/hero.js');
System.import('theme/theme.js');
