define([], function () {
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
					self.classList.contains('flat-button') &&
					oldValue !== newValue) {

					if (self.classList.contains('playing')) {
						console.log('fokin played');
						// playing
						onPlaying.dispatch();
					} else {
						console.log('fokin paused');
						// paused
						onPausing.dispatch();
					}
				}
				break;
		}
	}

	window.addEventListener('load', function () {
		var player = document.getElementById('player'),
			buttons = player.querySelector('div.player-middle');

		// observing changes to player's buttons
		observer.observe(buttons, {
			attributes: true,
			attributeOldValue: true,
			subtree: true,
			attributeFilter: ['class', 'disabled', 'value']
		});
	});

	return {
		onPlaying: onPlaying,
		onPausing: onPausing
	};
});
