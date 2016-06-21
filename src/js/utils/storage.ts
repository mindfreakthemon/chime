const SONGLYRICS_PROVIDER = `var div = document.createElement('div'); 
div.innerHTML = response.split('id=\"songLyricsDiv-outer\">')[1].split('</div>')[0].trim(); return div.firstChild.innerHTML;`;

const METROLYRICS_PROVIDER = `return response.split('id=\"lyrics-body-text\">')[1].split('</div>')[0];`;

const AZLYRICS_PROVIDER = `return response.split(' Sorry about that. -->')[1].split('<form')[0].trim();`;


let defaults = {
	notify_enabled: false,
	notify_resumed: false,
	notify_playing: false,
	notify_paused: false,
	notify_seeking: false,
	notify_stopped: false,
	notify_finished: false,
	notify_timeout: 3000,
	notify_default_icon: 'images/icon.png',

	hero_hidden: false,

	scrobbling_enabled: false,
	scrobbling_now_playing: false,
	scrobbling_api_secret: '672707041194c804c5973e54fb4ee520',
	scrobbling_api_key: '74639aa1297c3397d80d934196f1e542',
	scrobbling_api_url: 'https://ws.audioscrobbler.com/2.0/?',
	scrobbling_token: null,
	scrobbling_sessionID: null,
	scrobbling_min_length: 30000,
	scrobbling_min_percent: 0.5,

	lyrics_enabled: true,
	lyrics_providers: [
		['songlyrics.com', SONGLYRICS_PROVIDER],
		['metrolyrics.com', METROLYRICS_PROVIDER],
		['azlyrics.com', AZLYRICS_PROVIDER]
	],
	lyrics_filters: ['[\\(\\[](explicit|live|remastered)[^\\)]*[\\)\\]]'],

	theme_enabled: true,

	debug: false
};
let settings = {};
let onUpdateEvent = new chrome.Event();

chrome.storage.onChanged.addListener(changes => {
	Object.keys(changes)
		.forEach(key => settings[key] = changes[key].newValue);

	onUpdateEvent.dispatch(changes);
});

export default {
	get: (key) => {
		return key in settings ? settings[key] : defaults[key];
	},
	set: (key, value, callback?) => {
		let save = {};

		save[key] = value;

		chrome.storage.sync.set(save, callback);
	},
	remove: (key, callback) => {
		chrome.storage.sync.remove(key, callback);
	},
	getAll: () => {
		return Object.assign({}, defaults, settings);
	},

	onUpdate: onUpdateEvent,

	promise: new Promise(resolve => {
		chrome.storage.sync.get(defaults, (overrided) => {
			settings = overrided;
			resolve();
		});
	})
};
