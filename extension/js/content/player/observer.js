'use strict';

define(['exports'], function (exports) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	let onPlaying = exports.onPlaying = new chrome.Event();
	let onPausing = exports.onPausing = new chrome.Event();
	let onSeeking = exports.onSeeking = new chrome.Event();
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
	window.addEventListener('load', () => {
		let player = document.getElementById('player'),
		    slider = document.getElementById('material-player-progress'),
		    buttons = player.querySelector('div.material-player-middle');
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
});
//# sourceMappingURL=observer.js.map
