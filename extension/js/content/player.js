define(['events'], function (events) {
	var playingTimestamp = +new Date(),
		playingLastTimestamp = +new Date(),
		playedTime = 0, // how much time played
		playingTrack, // currently playing track
		playingTrackId; // G-id

	try {
		// if track was playing while
		// script was injected
		playingTrack = currentTrack();
	} catch (e) {
		console.log('no initial track was playing');
	}

	function playingParams(track) {
		return {
			playingTrack: track || playingTrack,
			playingTrackId: playingTrackId,
			playingTimestamp: playingTimestamp,
			playedTime: playedTime
		};
	}

	function currentStatus() {
		var player = document.getElementById('player'),
			play = document.querySelector('button[data-id=play-pause]'),
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
		var player = document.getElementById('player'),
			artist = player.querySelector('#player-artist'),
			album = player.querySelector('.player-album'),
			cover = player.querySelector('#playingAlbumArt'),
			title = player.querySelector('#playerSongTitle'),
			slider = document.getElementById('slider');

		return {
			title: title ? title.innerText : null,
			artist: artist ? artist.innerText : null,
			album: album ? album.innerText : null,
			cover: cover ? cover.src : cover,
			duration: +slider.getAttribute('aria-valuemax'),
			position: +slider.getAttribute('aria-valuenow'),
			id: playingTrackId
		};
	}

	function trackSign(track) {
		return track ?
			track.title + track.artist + track.album + track.cover + track.duration : Number.NaN;
	}

	function handlePlaying() {
		var main = document.getElementById('main'),
			track = currentTrack();

		// scrobbling stuff
		if (trackSign(playingTrack) === trackSign(track)) {
			// already was playing this track
			playingLastTimestamp = +new Date();

			// track was resumed
			events.dispatchEvent('chime-resumed', playingParams(track));
		} else {
			// first time setup
			playingTimestamp = +new Date();
			playingLastTimestamp = playingTimestamp;
			playedTime = 0;
			playingTrack = track;

			try {
				playingTrackId = main.querySelector('.song-row.currently-playing').dataset.id;
			} catch (e) {
				console.log('couldn\'t get track id on play start');
			}

			// track was started
			events.dispatchEvent('chime-playing', playingParams(track));
		}
	}

	function handlePausing() {
		playedTime += +new Date() - playingLastTimestamp;

		try {
			// trows exception if finished playing
			var track = currentTrack();

			if (trackSign(playingTrack) !== trackSign(track)) {
				// track has just finished
				events.dispatchEvent('chime-stopped', playingParams());

				// no need to do anything
				// because track will be playing now
				return;
			}

			// playback was paused
			events.dispatchEvent('chime-paused', playingParams(track));
		} catch (e) {
			// track has just finished
			events.dispatchEvent('chime-stopped', playingParams());
			// playlist was finished
			events.dispatchEvent('chime-finished', playingParams());

			playingTrack = null;
			playingTrackId = null;
			playingTimestamp = null;
			playingLastTimestamp = null;
			playedTime = 0;
		}
	}

	window.addEventListener('load', function () {
		var slider = document.getElementById('slider');

		slider.addEventListener('click', function () {
			if (playingTrack) {
				// user has clicked on slider
				events.dispatchEvent('chime-seeking', playingParams(currentTrack()));
			}
		})
	});

	return {
		currentTrack: currentTrack,
		trackSign: trackSign,
		currentStatus: currentStatus,
		playingParams: playingParams,
		handlePlaying: handlePlaying,
		handlePausing: handlePausing
	};
});
