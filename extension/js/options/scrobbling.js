define(['settings', 'lastfm', 'templates'], function (settings, lastfm, templates) {
	var loading = document.getElementById('last-fm-loading');

	var promise = new Promise(function (fullfil, reject) {
		lastfm.session(function (error, sessionID) {
			if (error) {
				reject();
				return;
			}

			var params = {
					method: 'user.getInfo',
					api_key: settings.get('scrobbling_api_key'),
					sk: sessionID,
					format: 'json'
				},
				api_sig = lastfm.sign(params),
				url = settings.get('scrobbling_api_url') + queryString(params) + '&api_sig=' + api_sig;

			var xhr = new XMLHttpRequest();

			xhr.open('GET', url);

			xhr.onerror = xhr.ontimeout = function () {
				reject();
			};

			xhr.timeout = 10000;

			xhr.onload = function () {
				var json = JSON.parse(xhr.responseText),
					user = json.user;

				if (user) {
					fullfil(user);
				} else {
					reject();
				}
			};

			xhr.send();
		});
	});

	promise
		.then(
		function (user) {
			loading.classList.add('hidden');

			document.getElementById('last-fm-account').innerHTML = templates.scrobbling({
				user: user
			});

			document.getElementById('last-fm-profile').classList.remove('hidden');
		}, function () {
			loading.classList.add('hidden');

			document.getElementById('last-fm-not-connected').classList.remove('hidden');
		});

	document.getElementById('last-fm-disconnect')
		.addEventListener('click', function () {
			chrome.storage.sync.remove(['scrobbling_token', 'scrobbling_sessionID'], function () {
				location.reload();
			});
		});

	document.getElementById('last-fm-connect')
		.addEventListener('click', function () {
			lastfm.authorize(function () {
				location.reload();
			});
		});
});
