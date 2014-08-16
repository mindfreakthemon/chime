define(['player', 'events', 'settings', 'lyrics/ui', 'lyrics/loader', 'loader!css:styles/lyrics.css'], function (player, events, settings, ui, loader) {
	var providers = settings.get('lyrics_providers'),
		providersOrigins = [];

	providers
		.forEach(function (provider) {
			providersOrigins.push('http://*.' + provider[0] + '/*', 'https://*.' + provider[0] + '/*');
		});

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
