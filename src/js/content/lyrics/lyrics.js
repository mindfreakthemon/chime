import * as player from 'content/player/player.js';
import storage from 'utils/storage.js';
import ui from 'content/lyrics/ui.js';
import loader from 'content/lyrics/loader.js';
import * as logger from 'utils/logger.js';

import TrackFactory from 'content/track/track.factory.js';

const LYRICS_ENABLED = storage.get('lyrics_enabled');

let providers = storage.get('lyrics_providers'),
	providersOrigins = providers.map(p => 'http://*.' + p[0] + '/*')
		.concat(providers.map(p => 'https://*.' + p[0] + '/*'));

async function callLoader() {
	if (!ui.isShown()) {
		return;
	}

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

ui.button.addEventListener('click', (e) => {
	// no one must know
	e.stopPropagation();

	var enabled = ui.isShown();

	logger.info('clicked on lyrics link. is enabled: %s', enabled);

	if (enabled) {
		ui.toggleShown();
		return;
	}

	chrome.runtime.sendMessage({
		permissions: {
			origins: providersOrigins
		},
		type: 'request'
	}, (granted) => {
		if (!granted) {
			logger.info('permission not granted');
			return;
		}

		ui.toggleShown();
		callLoader();
	});
});

window.addEventListener('beforeunload', () => {
	chrome.runtime.sendMessage({
		permissions: {
			origins: providersOrigins
		},
		type: 'remove'
	}, (removed) => {
		logger.info('lyrics permissions removed: %s', removed);
	});
});

ui.toggle(LYRICS_ENABLED);

player.onPlaying.addListener(callLoader);
