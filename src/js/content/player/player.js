import * as observer from 'player/observer';
import * as clock from 'player/clock';

import TrackFactory from 'track/track.factory';

export let onPlaying = new chrome.Event();
export let onResumed = new chrome.Event();
export let onStopped = new chrome.Event();
export let onPaused = new chrome.Event();
export let onFinished = new chrome.Event();
export let onSeeking = new chrome.Event();

let playingTrack, // currently playing track
	playingTrackWasCleaned = true;

observer.onSeeking.addListener(() => {
	if (playingTrack) {
		// user has clicked on slider
		onSeeking.dispatch(playingTrack);
	}
});

observer.onPlaying.addListener(() => {
	let track = TrackFactory.extract();

	if (track.equals(playingTrack) && !playingTrackWasCleaned) {
		// already was playing this track

		// adjust clock so that it will count correctly
		clock.adjust();

		// track was resumed
		onResumed.dispatch(track);
	} else {
		if (!playingTrackWasCleaned) {
			// track wasn't cleaned and looks like
			// handlePausing won't be called anymore

			// track has just finished
			onStopped.dispatch(playingTrack);
		}

		// first time setup
		playingTrackWasCleaned = false;
		playingTrack = track;

		clock.reset();

		// track was started
		onPlaying.dispatch(track);
	}
});

observer.onPausing.addListener(() => {
	// count played time
	clock.count();

	try {
		// trows exception if finished playing
		let track = TrackFactory.extract();

		if (!track.equals(playingTrack) || track.position === 0) {
			// track has just finished
			onStopped.dispatch(playingTrack);

			// marking this so that onStopped
			// won't be called twice
			playingTrackWasCleaned = true;

			// no need to do anything
			// because track will be playing now
			return;
		}

		// playback was paused
		onPaused.dispatch(track);
	} catch (e) {
		// track has just finished
		onStopped.dispatch(playingTrack);

		// playlist was finished
		onFinished.dispatch(playingTrack);

		// marking this so that onStopped
		// won't be called twice
		playingTrackWasCleaned = true;

		playingTrack = null;

		clock.reset();
	}
});

window.addEventListener('load', () => {
	try {
		// if track was playing while
		// script was injected
		playingTrack = TrackFactory.extract();

		clock.reset();
	} catch (e) {
		// it's ok
	}
});
