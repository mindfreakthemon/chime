define(['messenger'], function (messenger) {
	chrome.runtime.onMessage.addListener(messenger);

	chrome.runtime.onConnect.addListener(function (port) {
		port.onMessage.addListener(function (request) {
			console.log(arguments);
			//messenger(request, port.sender, port.postMessage())
		});
	});

});