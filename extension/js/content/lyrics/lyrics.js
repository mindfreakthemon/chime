define(['player/player', 'settings', 'lyrics/ui', 'lyrics/loader'], function (player, settings, ui, loader) {
	var logger = getLogger('lyrics'),
		providers = [],
		providersOrigins = [];

	settings.onUpdate.addListener(function (changes) {
		if (changes.lyrics_providers) {
			fillProviders();
		}

		if (changes.lyrics_enabled) {
			ui.toggle(changes.lyrics_enabled.newValue);
		}
	});

	function fillProviders() {
		logger('providers list was updated');

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
});
