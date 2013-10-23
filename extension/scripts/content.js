var player = document.querySelector('#player');

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch (request.command) {
			case 'status':
				var slider = document.querySelector('#slider');

				var data = {
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
				};

				try {
					var play = document.querySelector('button[data-id=play-pause]');
					data.playing = play.classList.contains('playing');
					data.play_enabled = !play.disabled;

					var shuffle = player.querySelector('[data-id="shuffle"]');
					data.shuffle = shuffle.disabled ? 'DISABLED' : shuffle.value;

					var repeat = player.querySelector('[data-id="repeat"]');
					data.repeat = repeat.value;

					data.forward_enabled = !player.querySelector('[data-id="forward"]').disabled;
					data.rewind_enabled = !player.querySelector('[data-id="rewind"]').disabled;

					data.title = player.querySelector('#playerSongTitle').innerText;
					data.artist = player.querySelector('#player-artist').innerText;
					data.album = player.querySelector('.player-album').innerText;
					data.cover = player.querySelector('#playingAlbumArt').src;

					data.total = slider.getAttribute('aria-valuemax');
					data.position = slider.getAttribute('aria-valuenow');
				} catch (e) {}

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
var element = player.querySelector('div.player-middle');

var observer = new WebKitMutationObserver(function (mutations) {
	mutations.forEach(attrModified);
});

observer.observe(element, {
	attributes: true,
	subtree: true,
	attributeFilter: ['class', 'disabled', 'value']
});

function attrModified(mutation) {
	var self = mutation.target,
		name = mutation.attributeName,
		newValue = self.getAttribute(name),
		oldValue = mutation.oldValue;

	console.log(name, newValue, oldValue);
}