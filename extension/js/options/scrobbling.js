define(['settings', 'lastfm', 'templates'], function (settings, lastfm, templates) {
	var loading = document.getElementById('last-fm-loading');

	var promise = lastfm.getProfile(),
		connect = document.getElementById('last-fm-connect');

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

	connect
		.addEventListener('click', function () {
			connect.disabled = true;

			loading.classList.remove('hidden');

			lastfm.core.authorize(function () {
				location.reload();
			});
		});
});
