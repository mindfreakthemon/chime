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

		return true;
	});
