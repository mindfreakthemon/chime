define(function () {
	var module = {};

	module.onReady = new chrome.Event();
	module.onStatus = new chrome.Event();

	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			if (request.register && !module.tab) {
				module.tab = sender.tab;

				sendResponse({});

				module.onReady.dispatch(module.tab);
			}
		});

	function updater() {
		chrome.tabs.sendMessage(module.tab.id, { command: 'status' }, module.onStatus.dispatch.bind(module.onStatus));
	}

	module.onReady.addListener(function () {
		updater();
		setInterval(updater, 500);
	});

	module.send = function (object) {
		chrome.tabs.sendMessage(module.tab.id, object);
	};

	module.activate = function () {
		chrome.tabs.update(module.tab.id, {
			active: true
		});
	};

	return module;
});