var music_tabs = [];

function _powerTab(callback, tab) {
	if (!tab._powered) {
		tab._powered = true;

		chrome.tabs.executeScript(tab.id, {
			file: 'scripts/utils.js'
		}, function () {
			chrome.tabs.executeScript(tab.id, {
				file: 'scripts/content/content.js'
			}, callback.bind(null, tab));
		});

	} else {
		callback(tab);
	}
}

function musicTab(callback) {
	if (music_tabs.length) {
		_powerTab(callback, music_tabs[0]);
		return;
	}

	if (settings.open_new) {
		chrome.tabs.create({
			index: 0,
			active: settings.open_active,
			pinned: settings.open_pinned,
			url: 'https://play.google.com/music/listen#/' + settings.default_playlist
		}, _powerTab.bind(null, callback));
	}
}

// fires only if browserAction popup is empty
chrome.browserAction.onClicked.addListener(function () {
	musicTab(function (tab) {
		chrome.tabs.update(tab.id, { selected: true });
	});
});

chrome.tabs.onCreated.addListener(updateTabs);
chrome.tabs.onRemoved.addListener(updateTabs);
chrome.tabs.onUpdated.addListener(updateTabs);
chrome.tabs.onRemoved.addListener(updateTabs);

function updateTabs() {
	chrome.tabs.query({
		url: 'https://play.google.com/music/listen*'
	}, function (tabs) {
		music_tabs = tabs;
	});
}
