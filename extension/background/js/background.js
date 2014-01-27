function applySettings() {
	// click_action
	chrome.browserAction.setPopup({
		popup: Settings.getItem('click_action') == 'focus' ? '' : chrome.runtime.getManifest().browser_action.default_popup
	});

	// native_hot_keys
	if (Settings.getItem('native_hot_keys')) {
		nativeHotkeysConnect();
	} else {
		nativeHotkeysDisconnect();
	}
}

chrome.storage.onChanged.addListener(applySettings);
Settings.promise.then(applySettings);

// fires only if browserAction popup is empty
chrome.browserAction.onClicked.addListener(function () {
	Tab.open(function (tab) {
		chrome.tabs.update(tab.id, { selected: true });
	});
});
