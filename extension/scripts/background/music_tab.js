var _music_tabs = [],
	_url_regexp = new RegExp('^https://play.google.com/music/listen', 'i');

function _powerTab(tab) {
	chrome.tabs.executeScript(tab.id, {
		file: 'scripts/utils.js'
	});

	chrome.tabs.executeScript(tab.id, {
		file: 'scripts/content/content.js'
	});
}

function _checkPowered(tab) {
	chrome.tabs.executeScript(tab.id, {
		code: 'document.body.getAttribute("data-chime-attached");'
	}, function (result) {
		if (result[0]) {
			// already powered
		} else {
			// not powered yet, new tab
			_powerTab(tab);
		}
	});
}

function _removeTab(id) {
	_music_tabs = _music_tabs.filter(function (tab) {
		return tab.id !== id;
	});
}

function _addTab(new_tab) {
	var found = _music_tabs.some(function (tab) {
		return tab.id == new_tab.id;
	});

	if (!found) {
		_music_tabs.unshift(new_tab);
	}
}

function _forceUpdate() {
	chrome.tabs.query({
		url: 'https://play.google.com/music/listen*'
	}, function (tabs) {
		tabs.forEach(function (tab) {
			_powerTab(tab);
		});

		_music_tabs = tabs;
	});
}

chrome.tabs.onRemoved.addListener(_removeTab);

chrome.tabs.onUpdated.addListener(function (id, diff, tab) {
	if (_url_regexp.test(tab.url)) {
		_addTab(tab);
		_checkPowered(tab);
	} else {
		_removeTab(id);
	}
});

// initial run
_forceUpdate();

function musicTab(callback) {
	if (_music_tabs.length) {
		callback(_music_tabs[0]);
		return;
	}

	if (settings.open_new) {
		chrome.tabs.create({
			index: 0,
			active: settings.open_active,
			pinned: settings.open_pinned,
			url: 'https://play.google.com/music/listen#/' + settings.default_playlist
		}, callback);
	}
}
