'use strict';

define(['messenger'], function (_messenger) {
	var _messenger2 = _interopRequireDefault(_messenger);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	chrome.runtime.onMessage.addListener(_messenger2.default);
	chrome.runtime.onConnect.addListener(function (port) {
		port.onMessage.addListener(function (request) {
			(0, _messenger2.default)(request, port.sender, port.postMessage());
		});
	});
});
//# sourceMappingURL=receiver.js.map
