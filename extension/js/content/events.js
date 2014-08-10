define([], function () {
	var spaceRegExp = /\s+/;

	function runEvent(names, params) {
		names.split(spaceRegExp)
			.forEach(function (name) {
				document.body.dispatchEvent(new CustomEvent(name, {
					detail: extend({}, params)
				}));
			});
	}

	function bindEvent(names, callback) {
		names.split(spaceRegExp)
			.forEach(function (name) {
				document.body.addEventListener(name, callback);
			});
	}

	function unbindEvent(names, callback) {
		names.split(spaceRegExp)
			.forEach(function (name) {
				document.body.removeEventListener(name, callback);
			});
	}

	return {
		dispatchEvent: runEvent,
		addEventListener: bindEvent,
		removeEventListener: unbindEvent
	}
});
