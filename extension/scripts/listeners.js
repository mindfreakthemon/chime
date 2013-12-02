/**
 * list of possible actions
 */

var actions = {
	// commands, which are resent directly to music tab
	'play-pause': function () {
		musicTab(function (tab) {
			chrome.tabs.sendMessage(tab.id, {
				command: 'click',
				id: 'play-pause'
			});
		});
	},
	'next-track': function () {
		musicTab(function (tab) {
			chrome.tabs.sendMessage(tab.id, {
				command: 'click',
				id: 'forward'
			});
		});
	},
	'prev-track': function () {
		musicTab(function (tab) {
			chrome.tabs.sendMessage(tab.id, {
				command: 'click',
				id: 'rewind'
			});
		});
	},
	'shuffle': function () {
		musicTab(function (tab) {
			chrome.tabs.sendMessage(tab.id, {
				command: 'click',
				id: 'shuffle'
			});
		});
	},
	'repeat': function () {
		musicTab(function (tab) {
			chrome.tabs.sendMessage(tab.id, {
				command: 'click',
				id: 'repeat'
			});
		});
	},

	'launch': function () {
		musicTab(function (tab) {
			chrome.tabs.update(tab.id, {
				selected: true
			});
		});
	},

	// used in popup
	'tab-id': function (msg, callback) {
		musicTab(function (tab) {
			callback(tab.id);
		});
	},

	'notify': function (msg, callback) {
		notify(msg.title, msg.body);
	}
};

/**
 * native messages api, only argument-less commands
 */
var port,
	reconnect_to = null;

function nativeHotkeysConnect() {
	if (port) {
		nativeHotkeysDisconnect();
	}

	port = chrome.runtime.connectNative('com.chime.hotkeys');

	port.onMessage.addListener(function (command) {
		if (actions[command]) {
			actions[command]();
		}
	});

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
 * commands api, only argument-less commands
 */
function commandsHandler(command) {
	if (actions[command]) {
		actions[command]();
	}
}

function commandsConnect() {
	chrome.commands.onCommand.addListener(commandsHandler);
}

function commandsDisconnect() {
	chrome.commands.onCommand.removeListener(commandsHandler);
}

/**
 * content scripts and popup page messages api, all commands
 */
function runtimeMessagesHangler(msg, sender, callback) {
	var command = msg.command;

	if (actions[command]) {
		actions[command](msg, callback);
	}
}

function runtimeMessagesConnect() {
	chrome.runtime.onMessage.addListener(runtimeMessagesHangler);
}

function runtimeMessagesDisconnect() {
	chrome.runtime.onMessage.removeListener(runtimeMessagesHangler);
}
