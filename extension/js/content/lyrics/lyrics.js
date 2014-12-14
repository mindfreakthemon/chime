define(['player', 'events', 'settings', 'lyrics/ui', 'lyrics/loader'], function (player, events, settings, ui, loader) {
	var logger = getLogger('lyrics');

	logger('lyrics was enabled');

	var providers = [],
		providersOrigins = [];

	fill();

	settings.onUpdate.addListener(function (changes) {
		if (changes.lyrics_providers) {
			logger('providers list was updated');

			fill();
		}
	});

	function fill() {
		logger('filling providers and origins');

		providers = settings.get('lyrics_providers');

		providers
			.forEach(function (provider) {
				providersOrigins.push('http://*.' + provider[0] + '/*', 'https://*.' + provider[0] + '/*');
			});
	}

	function callLoader() {
		ui.clearLyrics();
		ui.showLoading();

		loader(player.currentTrack(), function (error, data) {
			if (error) {
				ui.showError();
				return;
			}

			ui.setLyrics(data);
			ui.showLyrics();
		});
	}

	ui.button.addEventListener('click', function () {
		var enabled = ui.isShown();

		logger('clicked on lyrics link');

		chrome.runtime.sendMessage({
			permissions: {
				origins: providersOrigins
			},
			type: enabled ? 'remove' : 'request'
		}, function (granted) {
			if (!granted) {
				return;
			}

			ui.toggleShown();

			if (!enabled) {
				callLoader();
			}
		});
	});

	events.addEventListener('chime-playing', function () {
		if (ui.isShown()) {
			callLoader();
		}
	});
});
