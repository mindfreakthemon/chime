define([], function () {
	var frame = document.getElementById('sandbox'),
		hash = {};

	function requestSandbox(message, callback) {
		if (!message.id) {
			message.id = Date.now() + '' + Math.random();
		}

		hash[message.id] = callback;

		frame.contentWindow.postMessage(message, '*');
	}

	window.addEventListener('message', function (e) {
		var callback;

		if (e.data.id in hash) {
			callback = hash[e.data.id];

			// empty hash val
			delete hash[e.data.id];

			// run callback
			callback(e.data);
		}
	});

	return {
		request: requestSandbox
	};
});
