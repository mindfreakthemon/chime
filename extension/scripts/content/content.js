(function () {
	var player = document.querySelector('#player');

	function _info_status() {
		var play = document.querySelector('button[data-id=play-pause]'),
			shuffle = player.querySelector('[data-id="shuffle"]'),
			repeat = player.querySelector('[data-id="repeat"]');

		return {
			playing: play.classList.contains('playing'),
			play_enabled: !play.disabled,
			shuffle: shuffle.disabled ? 'DISABLED' : shuffle.value,
			repeat: repeat.value,
			forward_enabled: !player.querySelector('[data-id="forward"]').disabled,
			rewind_enabled: !player.querySelector('[data-id="rewind"]').disabled
		};
	}

	function _info_track() {
		return {
			title: player.querySelector('#playerSongTitle').innerText,
			artist: player.querySelector('#player-artist').innerText,
			album: player.querySelector('.player-album').innerText,
			cover: player.querySelector('#playingAlbumArt').src
		};
	}

	function _info_slider() {
		var slider = document.querySelector('#slider');

		return {
			total: slider.getAttribute('aria-valuemax'),
			position: slider.getAttribute('aria-valuenow')
		};
	}

	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			switch (request.command) {
				case 'status':
					var data = extend({
							playing: false,
							shuffle: 'NO_SHUFFLE',
							repeat: 'NO_REPEAT',
							play_enabled: true,
							forward_enabled: true,
							rewind_enabled: true,

							title: null,
							artist: null,
							album: null,
							cover: null,

							position: 0,
							total: 0
						},
						_info_status(),
						_info_track(),
						_info_slider());

					sendResponse(data);
					break;
				case 'click':
					// request.id in ['repeat', 'play-pause', 'forward', 'rewind', 'shuffle']
					var event = new MouseEvent('click', { bubbles: true }),
						el = player.querySelector('[data-id=' + request.id + ']');
					el.dispatchEvent(event);
					break;
			}
		});

	// Observing changes
	var element = player.querySelector('div.player-middle'),
		observer = new WebKitMutationObserver(function (mutations) {
			mutations.forEach(attrModified);
		});

	observer.observe(element, {
		attributes: true,
		attributeOldValue: true,
		subtree: true,
		attributeFilter: ['class', 'disabled', 'value']
	});

	function attrModified(mutation) {
		var self = mutation.target,
			name = mutation.attributeName,
			newValue = self.getAttribute(name),
			oldValue = mutation.oldValue;

		switch (self.dataset.id) {
			case 'repeat':
				break;
			case 'shuffle':
				break;
			case 'play-pause':
				if (name === 'class'
					&& self.classList.contains('flat-button')
					&& oldValue !== newValue
					&& /flat-button/.test(self.className)
					&& self.classList.contains('playing')) {

					var track = _info_track();

					chrome.runtime.sendMessage({
						command: 'notify',
						type: 'playing',
						track: track
					});
				}
				break;
			case 'forward':
				break;
		}
	}
})();
