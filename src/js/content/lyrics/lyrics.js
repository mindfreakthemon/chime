import * as player from 'player/player';
import settings from 'settings';
import ui from 'lyrics/ui';
import loader from 'lyrics/loader';

import TrackFactory from 'track/track.factory';

var logger = getLogger('lyrics'),
	providers = [],
	providersOrigins = [];

function fillProviders() {
	logger('providers list was updated');

	providers = settings.get('lyrics_providers');

	providers
		.forEach(function (provider) {
			providersOrigins.push('http://*.' + provider[0] + '/*', 'https://*.' + provider[0] + '/*');
		});
}

async function callLoader() {
	ui.clearLyrics();
	ui.showLoading();

	try {
		var data = await loader(TrackFactory.extract());

		ui.setLyrics(data);
		ui.showLyrics();
	} catch (error) {
		ui.showError();
	}
}

fillProviders();

ui.button.addEventListener('click', function () {
	var enabled = ui.isShown();

	logger('clicked on lyrics link. is enabled: %s', enabled);

	if (enabled) {
		ui.toggleShown();
		return;
	}

	chrome.runtime.sendMessage({
		permissions: {
			origins: providersOrigins
		},
		type: 'request'
	}, function (granted) {
		if (!granted) {
			logger('permission not granted');
			return;
		}

		ui.toggleShown();
		callLoader();
	});
});

window.addEventListener('beforeunload', function () {
	chrome.runtime.sendMessage({
		permissions: {
			origins: providersOrigins
		},
		type: 'remove'
	}, function (removed) {
		logger('lyrics permissions removed: %s', removed);
	});
});

ui.toggle(settings.get('lyrics_enabled'));

player.onPlaying.addListener(function () {
	if (ui.isShown()) {
		callLoader();
	}
});
