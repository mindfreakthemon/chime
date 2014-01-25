function _runEvent(name, params) {
	document.body.dispatchEvent(new CustomEvent(name, { detail: params }));
}

function _bindEvent(name, callback) {
	document.body.addEventListener(name, callback);
}

function _unbindEvent(name, callback) {
	document.body.removeEventListener(name, callback);
}

(function () {
	// unload previous content scripts
	_runEvent('chime-unload');
	// set marker so we are in busyness
	// used in music_tab.js for checking whether already attached
	document.body.setAttribute('data-chime-attached', 'true');

	var player = document.querySelector('#player'),
		slider = document.querySelector('#slider'),
		buttons = player.querySelector('div.player-middle'),
		observer = new WebKitMutationObserver(function (mutations) {
			mutations.forEach(_attrModified);
		});


	var	playingTimestamp,
		playingLastTimestamp,
		// how much played
		playedTime,
		// currently playing track
		playingTrack;


	function _infoStatus() {
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

	function _infoTrack() {
		var artist = player.querySelector('#player-artist'),
			album = player.querySelector('.player-album');

		return {
			title: player.querySelector('#playerSongTitle').innerText,
			artist: artist ? artist.innerText : null,
			album: album ? album.innerText : null,
			cover: player.querySelector('#playingAlbumArt').src,
			duration: slider.getAttribute('aria-valuemax'),
			position: slider.getAttribute('aria-valuenow')
		};
	}

	function _infoTrackSign(track) {
		return track ?
			track.title + track.artist + track.album + track.cover + track.duration : Number.NaN;
	}

	function _handleStatus(sendResponse) {
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
			duration: 0,
			position: 0
		};

		try {
			data = extend({}, data,
				_infoStatus());
		} catch (e) {
			// no status
		}

		try {
			data = extend({}, data,
				_infoTrack());
		} catch (e) {
			// no track paying
		}

		sendResponse(data);
	}

	function _handleClick(request) {
		// request.id in ['repeat', 'play-pause', 'forward', 'rewind', 'shuffle']
		var event = new MouseEvent('click', { bubbles: true }),
			el = player.querySelector('[data-id=' + request.id + ']');
		el.dispatchEvent(event);
	}

	function _handleSetPosition(request) {
		var event = new MouseEvent('mousedown', {
			clientX: Math.ceil(slider.clientWidth * request.position / slider.getAttribute('aria-valuemax')) + slider.offsetLeft
		});
		slider.dispatchEvent(event);
	}

	function _receiver(request, sender, sendResponse) {
		switch (request.command) {
			case 'status':
				_handleStatus(sendResponse);
				break;
			case 'setPosition':
				_handleSetPosition(request);
				break;
			case 'click':
				_handleClick(request);
				break;
			case 'unload':
				_handleUnload();
				break;
		}
	}

	function _handleUnload() {
		observer.disconnect();
		chrome.runtime.onMessage.removeListener(_receiver);
		_unbindEvent('chime-unload', _handleUnload);
	}

	function _handlePlaying() {
		var track = _infoTrack(),
			isTheSameTrack = _infoTrackSign(playingTrack) === _infoTrackSign(track);

		// scrobbling stuff
		if (isTheSameTrack) {
			// already was playing this track
			playingLastTimestamp = +new Date();
		} else {
			// first time setup
			playingTimestamp = +new Date();
			playingLastTimestamp = playingTimestamp;
			playedTime = 0;
			playingTrack = track;
		}

		_runEvent('chime-playing', {
			resumed: isTheSameTrack,
			playingTrack: playingTrack,
			playingTimestamp: playingTimestamp,
			playedTime: playedTime
		});
	}

	function _handlePausing() {
		var track,
			isPaused = true;

		playedTime += +new Date() - playingLastTimestamp;

		try {
			// trows exception if stopped
			track = _infoTrack();

			if (_infoTrackSign(playingTrack) !== _infoTrackSign(track)) {
				// no need to do anything
				// because track will be playing now
				return;
			}
		} catch (e) {
			isPaused = false;
			playingTrack = null;
		}

		_runEvent('chime-paused', {
			paused: isPaused,
			playingTrack: playingTrack,
			playingTimestamp: playingTimestamp,
			playedTime: playedTime
		});
	}

	function _attrModified(mutation) {
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
						_handlePlaying();
					} else {
						// paused
						_handlePausing();
					}
				}
				break;
		}
	}

	/**
	 * @receiveCommand
	 */
	chrome.runtime.onMessage.addListener(_receiver);

	// observing changes to player's buttons
	observer.observe(buttons, {
		attributes: true,
		attributeOldValue: true,
		subtree: true,
		attributeFilter: ['class', 'disabled', 'value']
	});

	_bindEvent('chime-unload', _handleUnload);
})();

/**
 * Scrobbling
 */
(function () {
	var scrobbleTimeout,
		scrobbledFlag = false,
		scrobbleMinDuration = 30000; // 30 sec

	function _sendScrobble(e) {
		if (scrobbledFlag) {
			// if already scrobbled
			return;
		}

		scrobbledFlag = true;

		chrome.runtime.sendMessage({
			command: 'scrobbling',
			type: 'scrobble',
			track: e.detail.playingTrack,
			timestamp: e.detail.playingTimestamp
		});
	}

	_bindEvent('chime-playing', function (e) {
		var track = e.detail.playingTrack;

		chrome.runtime.sendMessage({
			command: 'scrobbling',
			type: 'playing',
			track: track
		});

		if (e.detail.resumed) {
			scrobbleTimeout = setTimeout(_sendScrobble.bind(null, e), Math.floor(track.duration / 2 - e.detail.playedTime));
		} else if (track.duration > scrobbleMinDuration) {
			scrobbledFlag = false;
			scrobbleTimeout = setTimeout(_sendScrobble.bind(null, e), Math.floor(track.duration / 2));
		} else {
			// track is too small to scrobble it
			scrobbledFlag = true;
		}
	});

	_bindEvent('chime-paused', function (e) {
		clearTimeout(scrobbleTimeout);
		scrobbleTimeout = null;
	});

	_bindEvent('chime-unload', function _unload() {
		clearTimeout(scrobbleTimeout);
		_unbindEvent('chime-unload', _unload);
	});
})();

/**
  * Notifications
  */
(function () {
	_bindEvent('chime-playing', function (e) {
		var track = e.detail.playingTrack;

		chrome.runtime.sendMessage({
			command: 'notification',
			type: 'playing',
			track: track
		});

		if (!e.detail.resumed) {
			chrome.runtime.sendMessage({
				command: 'notification',
				type: 'playing-started',
				track: track
			});
		}
	});

	_bindEvent('chime-paused', function (e) {
		console.log('notifications', e);
		var track = e.detail.playingTrack;

		if (e.detail.paused) {
			chrome.runtime.sendMessage({
				command: 'notification',
				type: 'paused',
				track: track
			});
		} else {
			chrome.runtime.sendMessage({
				command: 'notification',
				type: 'stopped'
			});
		}
	});
})();
