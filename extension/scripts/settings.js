// default settings will be here
var settings = {
	click_action: 'focus',
	open_new: true,
	open_active: false,
	open_pinned: true,
	default_playlist: 'all',
	native_hot_keys: false
};

(function () {
	var data = localStorage.options;

	if (data) {
		try {
			updateSettings(JSON.parse(data));
			return;
		} catch (e) {}
	}

	localStorage.options = JSON.stringify(settings);
})();

function updateSettings(data) {
	Object.keys(data).forEach(function (k) {
		if (k in settings) {
			settings[k] = data[k];
		}
	});
}

function applySettings() {
	// click_action
	chrome.browserAction.setPopup({
		popup: settings.click_action == 'focus' ? '' : 'popup.html'
	});

	// native_hot_keys
	if (settings.native_hot_keys) {
		nativeHotkeysConnect();
	} else {
		nativeHotkeysDisconnect();
	}
}