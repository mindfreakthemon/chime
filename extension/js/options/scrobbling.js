'use strict';

define(['settings', 'lastfm', 'templates', 'body'], function (_settings, _lastfm, _templates) {
	var _settings2 = _interopRequireDefault(_settings);

	var lastfm = _interopRequireWildcard(_lastfm);

	var _templates2 = _interopRequireDefault(_templates);

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	let loading = document.getElementById('last-fm-loading');
	let connect = document.getElementById('last-fm-connect');
	lastfm.getProfile().then(function (user) {
		loading.classList.add('hidden');
		document.getElementById('last-fm-account').innerHTML = _templates2.default.scrobbling({
			user: user
		});
		document.getElementById('last-fm-profile').classList.remove('hidden');
	}).catch(function () {
		loading.classList.add('hidden');
		document.getElementById('last-fm-not-connected').classList.remove('hidden');
	});
	document.getElementById('last-fm-disconnect').addEventListener('click', function () {
		chrome.storage.sync.remove(['scrobbling_token', 'scrobbling_sessionID'], function () {
			location.reload();
		});
	});
	connect.addEventListener('click', function () {
		connect.disabled = true;
		loading.classList.remove('hidden');
		lastfm.core.authorize(function () {
			location.reload();
		});
	});
});
//# sourceMappingURL=scrobbling.js.map
