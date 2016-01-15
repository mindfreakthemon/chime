import storage from 'utils/storage.js';
import * as lastfm from 'lastfm/api.js';
import templates from 'templates/options.js';

let loading = document.getElementById('last-fm-loading');

let connect = document.getElementById('last-fm-connect');

lastfm.getProfile()
	.then(
		function (user) {
			loading.classList.add('hidden');

			document.getElementById('last-fm-account').innerHTML = templates.scrobbling({
				user: user
			});

			document.getElementById('last-fm-profile').classList.remove('hidden');
		})
	.catch(function () {
		loading.classList.add('hidden');

		document.getElementById('last-fm-not-connected').classList.remove('hidden');
	});

document.getElementById('last-fm-disconnect')
	.addEventListener('click', function () {
		chrome.storage.sync.remove(['scrobbling_token', 'scrobbling_sessionID'], function () {
			location.reload();
		});
	});

connect
	.addEventListener('click', function () {
		connect.disabled = true;

		loading.classList.remove('hidden');

		lastfm.core.authorize(function () {
			location.reload();
		});
	});
