Settings.promise.then(function () {
	var logger = getLogger('content');

	var playingTimestamp = +new Date(),
		playingLastTimestamp = +new Date(),
		playedTime = 0, // how much time played
		playingTrack, // currently playing track
		playingTrackId; // G-id

	var player = document.getElementById('player'),
		slider = document.getElementById('slider'),
		main = document.getElementById('main'),
		buttons = player.querySelector('div.player-middle'),
		observer = new WebKitMutationObserver(function (mutations) {
			mutations.forEach(attrModified);
		});

	try {
		// if track was playing while
		// script was injected
		playingTrack = currentTrack();
	} catch (e) {
		logger('no initial track was playing');
	}

	function currentStatus() {
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

	function currentTrack() {
		var artist = player.querySelector('#player-artist'),
			album = player.querySelector('.player-album'),
			cover = player.querySelector('#playingAlbumArt'),
			title = player.querySelector('#playerSongTitle');

		return {
			title: title ? title.innerText : null,
			artist: artist ? artist.innerText : null,
			album: album ? album.innerText : null,
			cover: cover ? cover.src : cover,
			duration: slider.getAttribute('aria-valuemax'),
			position: slider.getAttribute('aria-valuenow'),
			id: playingTrackId
		};
	}

	function trackSign(track) {
		return track ?
			track.title + track.artist + track.album + track.cover + track.duration : Number.NaN;
	}

	function playingParams() {
		return {
			playingTrack: playingTrack,
			playingTrackId: playingTrackId,
			playingTimestamp: playingTimestamp,
			playedTime: playedTime
		};
	}

	function click(id) {
		// request.id in ['repeat', 'play-pause', 'forward', 'rewind', 'shuffle']
		var event = new MouseEvent('click', {
				bubbles: true
			}),
			el = player.querySelector('[data-id=' + id + ']');
		el.dispatchEvent(event);

		logger('executed click on %s', id);
	}

	function setPosition(position) {
		var event = new MouseEvent('mousedown', {
			clientX: slider.offsetLeft +
				Math.ceil(slider.clientWidth * position / slider.getAttribute('aria-valuemax'))
		});
		slider.dispatchEvent(event);

		logger('executed setPosition on %d', position);
	}

	function receiver(request, sender, sendResponse) {
		switch (request.command) {
			case 'status':
				var data = {};

				try {
					data = extend({}, data,
						currentStatus());
				} catch (e) {
					// no status
				}

				try {
					data = extend({}, data,
						currentTrack());
				} catch (e) {
					// no track paying
				}

				sendResponse(data);
				break;
			case 'setPosition':
				setPosition(request.position);
				break;
			case 'click':
				click(request.id);
				break;
		}
	}

	function handlePlaying() {
		var track = currentTrack();

		// scrobbling stuff
		if (trackSign(playingTrack) === trackSign(track)) {
			// already was playing this track
			playingLastTimestamp = +new Date();

			// track was resumed
			runEvent('chime-resumed', playingParams());
		} else {
			// first time setup
			playingTimestamp = +new Date();
			playingLastTimestamp = playingTimestamp;
			playedTime = 0;
			playingTrack = track;

			try {
				playingTrackId = main.querySelector('.song-row.currently-playing').dataset.id;
			} catch (e) {
				logger('couldn\'t get track id on play start');
			}

			// track was started
			runEvent('chime-playing', playingParams());
		}
	}

	function handlePausing() {
		playedTime += +new Date() - playingLastTimestamp;

		try {
			// trows exception if finished playing
			var track = currentTrack();

			if (trackSign(playingTrack) !== trackSign(track)) {
				// track has just finished
				runEvent('chime-stopped', playingParams());

				// no need to do anything
				// because track will be playing now
				return;
			}

			// playback was paused
			runEvent('chime-paused', playingParams());
		} catch (e) {
			// track has just finished
			runEvent('chime-stopped', playingParams());
			// playlist was finished
			runEvent('chime-finished', playingParams());

			playingTrack = null;
			playingTrackId = null;
			playingTimestamp = null;
			playingLastTimestamp = null;
			playedTime = 0;
		}
	}

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
						// playing
						handlePlaying();
					} else {
						// paused
						handlePausing();
					}
				}
				break;
		}
	}

	chrome.runtime.onMessage.addListener(receiver);

	// observing changes to player's buttons
	observer.observe(buttons, {
		attributes: true,
		attributeOldValue: true,
		subtree: true,
		attributeFilter: ['class', 'disabled', 'value']
	});

	// external api for stuff
	window.setPosition = setPosition;
	window.click = click;
	window.currentTrack = currentTrack;
	window.trackSign = trackSign;
	window.currentStatus = currentStatus;
	window.playingParams = playingParams;
});
