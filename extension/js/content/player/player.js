'use strict';

define(['exports', 'player/observer', 'player/clock', 'track/track.factory'], function (exports, _observer, _clock, _track) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.onSeeking = exports.onFinished = exports.onPaused = exports.onStopped = exports.onResumed = exports.onPlaying = undefined;

	var observer = _interopRequireWildcard(_observer);

	var clock = _interopRequireWildcard(_clock);

	var _track2 = _interopRequireDefault(_track);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

	let onPlaying = exports.onPlaying = new chrome.Event();
	let onResumed = exports.onResumed = new chrome.Event();
	let onStopped = exports.onStopped = new chrome.Event();
	let onPaused = exports.onPaused = new chrome.Event();
	let onFinished = exports.onFinished = new chrome.Event();
	let onSeeking = exports.onSeeking = new chrome.Event();
	let playingTrack,
	    playingTrackWasCleaned = true;
	observer.onSeeking.addListener(() => {
		if (playingTrack) {
			onSeeking.dispatch(playingTrack);
		}
	});
	observer.onPlaying.addListener(() => {
		let track = _track2.default.extract();

		if (track.equals(playingTrack) && !playingTrackWasCleaned) {
			clock.adjust();
			onResumed.dispatch(track);
		} else {
			if (!playingTrackWasCleaned) {
				onStopped.dispatch(playingTrack);
			}

			playingTrackWasCleaned = false;
			playingTrack = track;
			clock.reset();
			onPlaying.dispatch(track);
		}
	});
	observer.onPausing.addListener(() => {
		clock.count();

		try {
			let track = _track2.default.extract();

			if (!track.equals(playingTrack) || track.position === 0) {
				onStopped.dispatch(playingTrack);
				playingTrackWasCleaned = true;
				return;
			}

			onPaused.dispatch(track);
		} catch (e) {
			onStopped.dispatch(playingTrack);
			onFinished.dispatch(playingTrack);
			playingTrackWasCleaned = true;
			playingTrack = null;
			clock.reset();
		}
	});
	window.addEventListener('load', () => {
		try {
			playingTrack = _track2.default.extract();
			clock.reset();
		} catch (e) {}
	});
});
//# sourceMappingURL=player.js.map
