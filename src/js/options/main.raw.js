System.config({
	baseURL: chrome.extension.getURL('/js/options'),
	paths: {
		'settings.js': chrome.extension.getURL('/js/misc/settings.js'),
		jade: chrome.extension.getURL('/vendor/jade/runtime.js'),
		md5: chrome.extension.getURL('/vendor/blueimp-md5/js/md5.min.js'),
		'lastfm.js': chrome.extension.getURL('/js/lastfm/api.js'),
		'lastfm/core.js': chrome.extension.getURL('/js/lastfm/core.js'),
		'styles/*': chrome.extension.getURL('/styles/*'),
		'templates-root': chrome.extension.getURL('/js/templates/options.js'),
		'templates.js': chrome.extension.getURL('/js/misc/templates.js')
	}
});

Promise.all([
		System.import('settings.js'),
		System.import('body.js')
	])
	.then(() => {
		System.import('navigation.js');
		System.import('modals.js');
		System.import('form.js');
		System.import('scrobbling.js');
		System.import('lyrics.js');
	});
