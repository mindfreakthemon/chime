window.addEventListener('storage', function (e) {
	if (e.key !== 'options') {
		return;
	}

	updateSettings(JSON.parse(e.newValue));
	applySettings();
});

// fires only if browserAction popup is empty
chrome.browserAction.onClicked.addListener(function () {
	musicTab(function (tab) {
		chrome.tabs.update(tab.id, { selected: true });
	});
});

applySettings();
