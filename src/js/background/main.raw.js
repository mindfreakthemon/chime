require.config({
	baseUrl: chrome.extension.getURL('/js/background'),
	paths: {
		settings: '../misc/settings'
	},
	deps: [
		'settings',
		'receiver',
		'update'
	]
});
