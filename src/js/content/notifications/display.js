import settings from 'settings';

var logger = getLogger('notifications/display'),
	clearer = {};

function clear(id) {
	chrome.runtime.sendMessage({
		notifications: {},
		id: 'chime-notification-' + id,
		type: 'clear'
	}, () => logger('notification was cleared: %s', id));
}

export default function (type, params) {
	if (clearer[type]) {
		clearTimeout(clearer[type]);
		delete clearer[type];
	}

	params.iconUrl = params.iconUrl || settings.get('notify_default_icon');

	logger('notification was sent: %s', type);

	chrome.runtime.sendMessage({
		notifications: params,
		id: 'chime-notification-' + type,
		type: 'create'
	}, () => clearer[type] = setTimeout(clear.bind(null, type), settings.get('notify_timeout')));
}
