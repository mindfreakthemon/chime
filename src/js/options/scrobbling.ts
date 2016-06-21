import storage from 'utils/storage';
import * as lastfm from 'lastfm/api';
import * as templates from 'templates/options';

let loading = document.getElementById('last-fm-loading');

let connect = <HTMLButtonElement> document.getElementById('last-fm-connect');

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
