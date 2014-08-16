define(['settings', 'lastfm'], function (settings, lastfm) {
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

			if (!user) {
				return;
			}

			var image = document.getElementById('last-fm-user-image'),
				username = document.getElementById('last-fm-user-name');

			username.innerText = user.name;
			image.src = user.image[1]['#text'];

			document.getElementById('last-fm-profile').removeAttribute('hidden');
			document.getElementById('last-fm-not-connected').setAttribute('hidden', 'hidden');
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
