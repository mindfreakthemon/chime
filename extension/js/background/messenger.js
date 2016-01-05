'use strict';

define(['exports', 'sandbox', 'remote'], function (exports, _sandbox, _remote) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (request, sender, callback) {
		if (request.remote) {
			(0, _remote2.default)(request.remote, callback);
		}

		if (request.sandbox) {
			(0, _sandbox2.default)(request.sandbox, callback);
		}

		if (request.permissions) {
			chrome.permissions[request.type](request.permissions, callback);
		}

		if (request.notifications) {
			switch (request.type) {
				case 'clear':
					chrome.notifications.clear(request.id, callback);
					break;

				default:
					chrome.notifications[request.type](request.id, request.notifications, callback);
			}
		}

		if (request.windows) {
			switch (request.type) {
				case 'update':
				case 'get':
					chrome.windows[request.type](request.id, request.windows, callback);
					break;
				case 'remove':
					chrome.windows.remove(request.id, callback);
					break;
				default:
					chrome.windows[request.type](request.windows, callback);
			}
		}

		return true;
	};

	var _sandbox2 = _interopRequireDefault(_sandbox);

	var _remote2 = _interopRequireDefault(_remote);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}
});
//# sourceMappingURL=messenger.js.map
