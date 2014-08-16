require.config({
	baseUrl: chrome.extension.getURL('/js/background'),
	paths: {},
	deps: [
		'messenger'
	]
});
