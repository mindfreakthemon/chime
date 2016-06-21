import * as core from 'lastfm/core';
import storage from 'utils/storage';
import * as querystring from 'utils/querystring';

export { core };

export async function nowPlaying(track) {
	let sessionID = await core.session();

	let params = {
			method: 'track.updateNowPlaying',
			track: track.title,
			artist: track.artist,
			album: track.album,
			duration: Math.ceil(track.duration / 1000),
			api_key: storage.get('scrobbling_api_key'),
			sk: sessionID,
			format: 'json'
		},
		api_sig = core.sign(params),
		url = storage.get('scrobbling_api_url');

	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: querystring.stringify(params) + '&api_sig=' + api_sig
	});
}

export async function scrobble(timestamp, track) {
	let sessionID = await core.session();

	let params = {
			method: 'track.scrobble',
			timestamp: Math.floor(timestamp / 1000),
			track: track.title,
			artist: track.artist,
			album: track.album,
			api_key: storage.get('scrobbling_api_key'),
			sk: sessionID,
			format: 'json'
		},
		api_sig = core.sign(params),
		url = storage.get('scrobbling_api_url');

	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: querystring.stringify(params) + '&api_sig=' + api_sig
	});
}

export async function getProfile() {
	let sessionID = await core.session();

	let params = {
			method: 'user.getInfo',
			api_key: storage.get('scrobbling_api_key'),
			sk: sessionID,
			format: 'json'
		},
		api_sig = core.sign(params),
		url = storage.get('scrobbling_api_url') + querystring.stringify(params) + '&api_sig=' + api_sig;

	let json = await fetch(url)
		.then((response) => response.json());

	if (json.error) {
		return Promise.reject(json.error);
	}

	return json.user;
}
