import settings from 'settings.js';

chrome.runtime.onInstalled.addListener(function (details) {
	var providers;

	if (details.reason === 'app_update') {
		providers = settings.get('lyrics_providers');

		providers.forEach(function (data) {
			if (data[0] === 'azlyrics.com') {
				data[1] = "return response.split('<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->')[1].split('<!-- MxM banner -->')[0].trim();";
			}
		});

		settings.set('lyrics_providers', providers);
	}
});
