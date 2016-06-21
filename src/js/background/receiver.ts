import messenger from 'background/messenger';

chrome.runtime.onMessage.addListener(messenger);

chrome.runtime.onConnect.addListener(port =>
	port.onMessage.addListener(request =>
		messenger(request, port.sender, (response) =>
			port.postMessage(response)
		)
	)
);
