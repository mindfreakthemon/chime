/**
 * list of possible actions
 */
var _actions = {
	click: function (id) {
		musicTab(function (tab) {
			/**
			 * @sendCommand to tab
			 */
			chrome.tabs.sendMessage(tab.id, {
				command: 'click',
				id: id
			});
		});
	},
	launch: function () {
		musicTab(function (tab) {
			chrome.tabs.update(tab.id, {
				selected: true
			});
		});
	},
	tabId: function (msg, callback) {
		musicTab(function (tab) {
			callback(tab.id);
		});
	},
	notification: function (msg) {
		notificationHandler(msg);
	},
	scrobbling: function (msg, callback) {
		scrobblingHandler(msg, callback);
	}
};

function _splitRun(command) {
	var parts = command.split(':'),
		action = parts[0],
		arg = parts[1];

	if (_actions[action]) {
		_actions[action](arg);
	}
}

/**
 * native messages api
 */
var port,
	reconnect_to = null;

function nativeHotkeysConnect() {
	if (port) {
		nativeHotkeysDisconnect();
	}

	port = chrome.runtime.connectNative('com.chime.hotkeys');

	port.onMessage.addListener(_splitRun);

	port.onDisconnect.addListener(function () {
		notify('Hotkey Server', 'Can\'t connect to hotkey server.\nPlease, ensure you have it installed.', 0);

		reconnect_to = setTimeout(nativeHotkeysConnect, 60000);
	});
}

function nativeHotkeysDisconnect() {
	if (!port) {
		return;
	}

	port.disconnect();
	port = null;
	clearTimeout(reconnect_to);
}

/**
 * commands api
 */
function commandsConnect() {
	commandsDisconnect();

	chrome.commands.onCommand.addListener(_splitRun);
}

function commandsDisconnect() {
	chrome.commands.onCommand.removeListener(_splitRun);
}

/**
 * content scripts and popup page messages api, all commands
 */
function runtimeMessagesHangler(msg, sender, callback) {
	var command = msg.command;

	if (_actions[command]) {
		_actions[command](msg, callback);
	}

	return true;
}

function runtimeMessagesConnect() {
	runtimeMessagesDisconnect();

	chrome.runtime.onMessage.addListener(runtimeMessagesHangler);
}

function runtimeMessagesDisconnect() {
	chrome.runtime.onMessage.removeListener(runtimeMessagesHangler);
}
