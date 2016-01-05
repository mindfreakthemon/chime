import * as player from 'player/player';

let playedTime = 0,
	playingTimestamp = 0,
	playingLastTimestamp = 0;

export function reset() {
	playedTime = 0;
	playingTimestamp = +new Date();
	playingLastTimestamp = +new Date();
}

export function adjust() {
	playingLastTimestamp = +new Date();
}

export function count() {
	playedTime += +new Date() - playingLastTimestamp;
}

export function getStartTimestamp() {
	return playingTimestamp;
}

export function getPlayedTime() {
	return playedTime;
}
