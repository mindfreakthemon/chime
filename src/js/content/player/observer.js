import { onLoad } from 'content/loader.js';

export let onPlaying = new chrome.Event();
export let onPausing = new chrome.Event();
export let onSeeking = new chrome.Event();

let observer = new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		var self = mutation.target,
			name = mutation.attributeName,
			dataset = self.dataset || {},
			newValue = self.getAttribute(name),
			oldValue = mutation.oldValue;

		switch (dataset.id) {
			case 'play-pause':
				if (name === 'class' && oldValue !== newValue) {
					if (self.classList.contains('playing')) {
						onPlaying.dispatch();
					} else {
						onPausing.dispatch();
					}
				}

				break;
		}
	});
});

onLoad(() => {
	let player = document.getElementById('player'),
		slider = document.getElementById('material-player-progress'),
		buttons = player.querySelector('div.material-player-middle');

	// observing changes to player's buttons
	observer.observe(buttons, {
		attributes: true,
		attributeOldValue: true,
		subtree: true,
		attributeFilter: ['class', 'disabled', 'value']
	});

	slider.addEventListener('click', function () {
		onSeeking.dispatch();
	});
});
