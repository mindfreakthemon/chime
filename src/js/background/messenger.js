import sandbox from 'sandbox.js';
import remote from 'remote.js';

export default function (request, sender, callback) {
	if (request.remote) {
		remote(request.remote, callback);
	}

	if (request.sandbox) {
		sandbox(request.sandbox, callback);
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
}
