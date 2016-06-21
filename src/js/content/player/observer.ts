import { onLoad } from 'content/loader';

export let onPlaying = new chrome.Event();
export let onPausing = new chrome.Event();
export let onSeeking = new chrome.Event();

let observer = new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		let self = <HTMLElement> mutation.target;
		let name = mutation.attributeName;
		let dataset = self.dataset || {};
		let newValue = self.getAttribute(name);
		let oldValue = mutation.oldValue;

		switch (dataset['id']) {
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
	let player = document.getElementById('player');
	let slider = document.getElementById('material-player-progress');
	let buttons = player.querySelector('div.material-player-middle');

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
