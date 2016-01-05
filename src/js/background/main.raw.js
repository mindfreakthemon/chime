System.config({
	baseURL: chrome.extension.getURL('/js/background'),
	paths: {
		'settings.js': chrome.extension.getURL('/js/misc/settings.js')
	}
});

System.import('receiver.js');
System.import('update.js');
