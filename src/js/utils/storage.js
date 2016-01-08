var defaults = {
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
		['songlyrics.com', "var div = document.createElement('div'); div.innerHTML = response.split('id=\"songLyricsDiv-outer\">')[1].split('</div>')[0].trim(); return div.firstChild.innerHTML;"],
		['metrolyrics.com', "return response.split('id=\"lyrics-body-text\">')[1].split('</div>')[0];"],
		['azlyrics.com', "return response.split('<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->')[1].split('<form')[0].trim();"]
	],
	lyrics_filters: ['[\\(\\[](explicit|live|remastered)[^\\)]*[\\)\\]]'],

	theme_enabled: true,

	debug: false
}, settings = {}, onUpdateEvent = new chrome.Event();

chrome.storage.onChanged.addListener((changes) => {
	Object.keys(changes)
		.forEach(function (key) {
			settings[key] = changes[key].newValue;
		});

	onUpdateEvent.dispatch(changes);
});

export default {
	get: (key) => {
		return key in settings ? settings[key] : defaults[key];
	},
	set: (key, value, callback) => {
		var save = {};
		save[key] = value;

		chrome.storage.sync.set(save, callback);
	},
	remove: function (key, callback) {
		chrome.storage.sync.remove(key, callback);
	},
	getAll: () => {
		return Object.assign({}, defaults, settings);
	},

	onUpdate: onUpdateEvent,

	promise: new Promise((fulfill) => {
		chrome.storage.sync.get(defaults, (overrided) => {
			settings = overrided;
			fulfill();
		});
	})
};
