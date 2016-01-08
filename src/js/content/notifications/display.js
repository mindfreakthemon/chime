import storage from 'utils/storage.js';
import * as logger from 'utils/logger.js';

var clearer = {};

function clear(id) {
	chrome.runtime.sendMessage({
		notifications: {},
		id: 'chime-notification-' + id,
		type: 'clear'
	}, () => logger.info('notification was cleared: %s', id));
}

export default function (type, params) {
	if (clearer[type]) {
		clearTimeout(clearer[type]);
		delete clearer[type];
	}

	params.iconUrl = params.iconUrl || chrome.extension.getURL(storage.get('notify_default_icon'));

	logger.info('notification was sent: %s', type);

	chrome.runtime.sendMessage({
		notifications: params,
		id: 'chime-notification-' + type,
		type: 'create'
	}, () => clearer[type] = setTimeout(clear.bind(null, type), storage.get('notify_timeout')));
}
