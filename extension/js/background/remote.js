define([], function () {
	var logger = getLogger('remote');

	return function (data, callback) {
		var url = data.url,
			xhr = new XMLHttpRequest();

		xhr.onload = function () {
			logger('got response on request to %s', url);

			callback({
				response: xhr.responseText
			});
		};

		xhr.ontimeout = function () {
			logger('remote request to %s timed out', url);

			callback({
				error: 'timeout'
			});
		};

		xhr.onerror = function (e) {
			logger('error on request to %s: %s', url, e.toString());

			callback({
				error: e.toString()
			});
		};

		xhr.timeout = (data.timeout || 30) * 1000;

		logger('making GET request to %s (timeout on %s)', url, xhr.timeout);

		xhr.open('GET', url, true);
		xhr.send();
	};
});
