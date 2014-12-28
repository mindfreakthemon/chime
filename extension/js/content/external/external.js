define(['settings'], function (settings) {
	var logger = getLogger('external');

	logger('external player was enabled');

	var externalWindow = null,
		miniPlayer;

	window.addEventListener('load', addButton);
	window.addEventListener('beforeunload', close);

	function addButton() {
		miniPlayer = document.querySelector('[data-id=show-miniplayer]');
		miniPlayer.addEventListener('click', click);
	}

	function click(e) {
		if (!settings.get('player_enabled')) {
			return;
		}

		e.stopPropagation();

		var promise = new Promise(handle);

		miniPlayer.disabled = true;

		promise.then(function () {
			miniPlayer.disabled = false;
		});
	}

	function handle(resolve, reject) {
		if (!externalWindow) {
			return open(resolve, reject);
		}

		logger('checking previous external player');

		chrome.runtime.sendMessage({
			windows: {},
			id: externalWindow.id,
			type: 'get'
		}, function (window) {
			if (window) {
				focus(resolve, reject);
			} else {
				open(resolve, reject);
			}
		});
	}

	function focus(resolve, reject) {
		logger('focusing on existing player');

		chrome.runtime.sendMessage({
			windows: {
				state: 'maximized',
				focused: true
			},
			id: externalWindow.id,
			type: 'update'
		}, function (window) {
			resolve(window);
		});
	}

	function open(resolve, reject) {
		logger('opening external player');

		chrome.runtime.sendMessage({
			windows: {
				width: settings.get('player_width'),
				height: settings.get('player_height'),
				focused: true,
				type: 'panel',
				url: chrome.extension.getURL('/pages/player.html')
			},
			type: 'create'
		}, function (window) {
			externalWindow = window;

			resolve(window);

			sendId();
		});
	}

	function sendId() {
		if (!externalWindow) {
			logger('no external window found');
			return;
		}

		var tab = externalWindow.tabs[0];

		chrome.runtime.sendMessage({
			register: {},
			id: tab.id
		}, function () {});
	}

	function close() {
		logger('closing window');

		chrome.runtime.sendMessage({
			windows: {},
			id: externalWindow.id,
			type: 'remove'
		}, function () {
			externalWindow = null;
		});
	}
});