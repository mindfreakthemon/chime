define(['settings', 'lastfm', 'templates'], function (settings, lastfm, templates) {
	lastfm.session(function (error, sessionID) {
		if (error) {
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
		xhr.onload = function () {
			var json = JSON.parse(xhr.responseText),
				user = json.user;

			document.getElementById('last-fm-loading').classList.add('hidden');

			if (user) {
				document.getElementById('last-fm-account').innerHTML = templates.scrobbling({
					user: user
				});

				document.getElementById('last-fm-profile').classList.remove('hidden');
			} else {
				document.getElementById('last-fm-not-connected').classList.remove('hidden');
			}
		};

		xhr.send();
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
