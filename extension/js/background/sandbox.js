'use strict';

define(['exports'], function (exports) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (message, callback) {
		if (!message.id) {
			message.id = Date.now() + '' + Math.random();
		}

		hash[message.id] = callback;

		frame.contentWindow.postMessage(message, '*');
	};

	var frame = document.getElementById('sandbox'),
	    hash = {};
	window.addEventListener('message', function (e) {
		var callback;

		if (e.data.id in hash) {
			callback = hash[e.data.id];
			delete hash[e.data.id];
			callback(e.data);
		}
	});
});
//# sourceMappingURL=sandbox.js.map
