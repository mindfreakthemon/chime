define(['settings'], function (settings) {
	var logger = getLogger('notifications/display'),
		clearer = {};

	function clear(id) {
		chrome.runtime.sendMessage({
			notifications: {},
			id: 'chime-notification-' + id,
			type: 'clear'
		}, function () {
			logger('notification was cleared: %s', id);
		});
	}

	return function (type, params) {
		if (clearer[type]) {
			clearTimeout(clearer[type]);
			delete clearer[type];
		}

		logger('notification was sent: %s', type);

		params.iconUrl = params.iconUrl || settings.get('notify_default_icon');

		chrome.runtime.sendMessage({
			notifications: params,
			id: 'chime-notification-' + type,
			type: 'create'
		}, function () {
			clearer[type] = setTimeout(clear.bind(null, type), settings.get('notify_timeout'));
		});
	}
});