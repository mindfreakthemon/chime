import storage from 'utils/storage.js';
import * as lastfm from 'lastfm/api.js';
import templates from 'templates/options.js';

let loading = document.getElementById('last-fm-loading');

let connect = document.getElementById('last-fm-connect');

lastfm.getProfile()
	.then(user => {
		loading.classList.add('hidden');

		document.getElementById('last-fm-account').innerHTML = templates.scrobbling({
			user: user
		});

		document.getElementById('last-fm-profile').classList.remove('hidden');
	})
	.catch(() => {
		loading.classList.add('hidden');

		document.getElementById('last-fm-not-connected').classList.remove('hidden');
	});

document.getElementById('last-fm-disconnect')
	.addEventListener('click', () => storage.remove(['scrobbling_token', 'scrobbling_sessionID'], () => location.reload()));

connect
	.addEventListener('click', () => {
		connect.disabled = true;

		loading.classList.remove('hidden');

		lastfm.core.authorize(() => location.reload());
	});
