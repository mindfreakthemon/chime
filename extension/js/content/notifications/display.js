'use strict';

define(['exports', 'settings'], function (exports, _settings) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (type, params) {
		if (clearer[type]) {
			clearTimeout(clearer[type]);
			delete clearer[type];
		}

		params.iconUrl = params.iconUrl || _settings2.default.get('notify_default_icon');

		logger('notification was sent: %s', type);

		chrome.runtime.sendMessage({
			notifications: params,
			id: 'chime-notification-' + type,
			type: 'create'
		}, () => clearer[type] = setTimeout(clear.bind(null, type), _settings2.default.get('notify_timeout')));
	};

	var _settings2 = _interopRequireDefault(_settings);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var logger = getLogger('notifications/display'),
	    clearer = {};

	function clear(id) {
		chrome.runtime.sendMessage({
			notifications: {},
			id: 'chime-notification-' + id,
			type: 'clear'
		}, () => logger('notification was cleared: %s', id));
	}
});
//# sourceMappingURL=display.js.map
