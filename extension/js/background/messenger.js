define(['sandbox', 'remote'], function (sandbox, remote) {
	chrome.runtime.onMessage.addListener(
		function (request, sender, callback) {
			if (request.url) {
				remote.request(request.url, callback);
			}

			if (request.permissions) {
				chrome.permissions[request.type](request.permissions, callback);
			}

			if (request.notifications) {
				chrome.notifications[request.type](request.id, request.notifications, callback);
			}

			if (request.notification) {
				chrome.notifications.clear(request.notification, callback);
			}

			if (request.sandbox) {
				sandbox.request(request.sandbox, callback);
			}

			return true;
		});

});
