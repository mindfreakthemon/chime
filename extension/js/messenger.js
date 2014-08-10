chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var xhr = new XMLHttpRequest(),
			url = request.url;

		xhr.onload = function () {
			sendResponse({
				response: xhr.responseText
			});
		};

		xhr.open('GET', url, true);
		xhr.send();

		return true;
	});
