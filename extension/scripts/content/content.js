(function () {
	// unload previous content scripts
	document.body.dispatchEvent(new Event('chime-unload'));
	// set marker so we are in busyness
	document.body.setAttribute('data-chime-attached', 'true');

	var player = document.querySelector('#player'),
		slider = document.querySelector('#slider'),
		buttons = player.querySelector('div.player-middle'),
		observer = new WebKitMutationObserver(function (mutations) {
			mutations.forEach(_attrModified);
		});

	var	scrobbleTimeout,
		scrobbledFlag = false,
		scrobbleMinDuration = 30000,
		playingTimestamp,
		playingLastTimestamp,
		playedTime,
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
		return {
			title: player.querySelector('#playerSongTitle').innerText,
			artist: player.querySelector('#player-artist').innerText,
			album: player.querySelector('.player-album').innerText,
			cover: player.querySelector('#playingAlbumArt').src,
			duration: slider.getAttribute('aria-valuemax'),
			position: slider.getAttribute('aria-valuenow')
		};
	}

	function _infoTrackSign(track) {
		return track ?
			track.title + track.artist + track.album + track.cover + track.duration : Number.NaN;
	}

	function _sendScrobble() {
		if (scrobbledFlag) {
			// if already scrobbled
			return;
		}

		scrobbledFlag = true;

		/**
		 * @sendCommand to background
		 */
		chrome.runtime.sendMessage({
			command: 'scrobbling',
			type: 'scrobble',
			track: playingTrack,
			timestamp: playingTimestamp
		});
	}

	function _receiver(request, sender, sendResponse) {
		switch (request.command) {
			case 'status':
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
				break;
			case 'click':
				// request.id in ['repeat', 'play-pause', 'forward', 'rewind', 'shuffle']
				var event = new MouseEvent('click', { bubbles: true }),
					el = player.querySelector('[data-id=' + request.id + ']');
				el.dispatchEvent(event);
				break;
			case 'unload':
				_unload();
				break;
		}
	}

	function _unload() {
		observer.disconnect();
		clearTimeout(scrobbleTimeout);
		chrome.runtime.onMessage.removeListener(_receiver);
		document.body.removeEventListener('chime-unload', _unload);
	}

	function _attrModified(mutation) {
		var self = mutation.target,
			name = mutation.attributeName,
			newValue = self.getAttribute(name),
			oldValue = mutation.oldValue,
			track;

		switch (self.dataset.id) {
			case 'play-pause':
				if (name === 'class' &&
					self.classList.contains('flat-button') &&
					oldValue !== newValue) {

					if (self.classList.contains('playing')) {
						// playing

						track = _infoTrack();

						/**
						 * @sendCommand to background
						 */
						chrome.runtime.sendMessage({
							command: 'notification',
							type: 'playing',
							track: track
						});

						/**
						 * @sendCommand to background
						 */
						chrome.runtime.sendMessage({
							command: 'scrobbling',
							type: 'playing',
							track: track
						});

						// scrobbling stuff
						if (_infoTrackSign(playingTrack) === _infoTrackSign(track)) {
							// already was playing this track

							playingLastTimestamp = +new Date();
							scrobbleTimeout = setTimeout(_sendScrobble, Math.floor(track.duration / 2 - playedTime));
						} else if (track.duration > scrobbleMinDuration) {
							// first time setup

							playingTimestamp = +new Date();
							playingLastTimestamp = playingTimestamp;
							playedTime = 0;
							playingTrack = track;
							scrobbledFlag = false;
							scrobbleTimeout = setTimeout(_sendScrobble, Math.floor(track.duration / 2));

							/**
							 * @sendCommand to background
							 */
							chrome.runtime.sendMessage({
								command: 'notification',
								type: 'playing-started',
								track: track
							});
						} else {
							// track is too small to scrobble it
						}
					} else {
						// paused

						clearTimeout(scrobbleTimeout);
						scrobbleTimeout = null;
						playedTime += +new Date() - playingLastTimestamp;

						try {
							track = _infoTrack();

							if (_infoTrackSign(playingTrack) === _infoTrackSign(track)) {
								/**
								 * @sendCommand to background
								 */
								chrome.runtime.sendMessage({
									command: 'notification',
									type: 'paused',
									track: track
								});
							} else {
								// new song
							}
						} catch (e) {
							/**
							 * @sendCommand to background
							 */
							chrome.runtime.sendMessage({
								command: 'notification',
								type: 'stopped'
							});
						}
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

	document.body.addEventListener('chime-unload', _unload);
})();
