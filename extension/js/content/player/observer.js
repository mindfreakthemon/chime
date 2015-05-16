define([], function () {
	var logger = getLogger('player/observer');

	var onPlaying = new chrome.Event(),
		onPausing = new chrome.Event();

	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(attrModified);
	});

	function attrModified(mutation) {
		var self = mutation.target,
			name = mutation.attributeName,
			newValue = self.getAttribute(name),
			oldValue = mutation.oldValue;

		switch (self.dataset.id) {
			case 'play-pause':
				if (name === 'class' &&
					//self.classList.contains('flat-button') &&
					oldValue !== newValue) {

					if (self.classList.contains('playing')) {
						logger('playing');

						// playing
						onPlaying.dispatch();
					} else {
						logger('pausing');

						// paused
						onPausing.dispatch();
					}
				}
				break;
		}
	}

	function load() {
		var player = document.getElementById('player'),
			buttons = player.querySelector('div.material-player-middle');

		// observing changes to player's buttons
		observer.observe(buttons, {
			attributes: true,
			attributeOldValue: true,
			subtree: true,
			attributeFilter: ['class', 'disabled', 'value']
		});
	}

	if (document.readyState === 'complete') {
		load();
	} else {
		window.addEventListener('load', load);
	}

	return {
		onPlaying: onPlaying,
		onPausing: onPausing
	};
});
