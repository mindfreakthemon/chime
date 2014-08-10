function requestUrl(url, callback) {
	var xhr = new XMLHttpRequest();

	xhr.onload = function () {
		callback({
			response: xhr.responseText
		});
	};

	xhr.open('GET', url, true);
	xhr.send();
}

chrome.runtime.onMessage.addListener(
	function(request, sender, callback) {

		if (request.url) {
			requestUrl(request.url, callback);
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

		return true;
	});
