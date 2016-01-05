import messenger from 'messenger';

chrome.runtime.onMessage.addListener(messenger);

chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(function (request) {
		messenger(request, port.sender, port.postMessage());
	});
});