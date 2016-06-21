let playedTime = 0;
let playingTimestamp = 0;
let playingLastTimestamp = 0;

export function reset() {
	playedTime = 0;
	playingTimestamp = +new Date();
	playingLastTimestamp = +new Date();
}

export function stage() {
	playingLastTimestamp = +new Date();
}

export function commit() {
	playedTime += +new Date() - playingLastTimestamp;
}

export function getStartTimestamp() {
	return playingTimestamp;
}

export function getPlayedTime() {
	return playedTime;
}
