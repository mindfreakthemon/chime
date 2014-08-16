define(function () {
	var defaults = {
		notify_enabled: false,
//		notify_origins: ['https://*.googleusercontent.com/*'],
		notify_resumed: false,
		notify_playing: false,
		notify_paused: false,
		notify_seeking: false,
		notify_stopped: false,
		notify_finished: false,
		notify_default_icon: 'images/icon.png',

		scrobbling_enabled: false,
//		scrobbling_api_origins: ['https://ws.audioscrobbler.com/2.0/*'],
		scrobbling_now_playing: false,
		scrobbling_api_secret: '672707041194c804c5973e54fb4ee520',
		scrobbling_api_key: '74639aa1297c3397d80d934196f1e542',
		scrobbling_api_url: 'https://ws.audioscrobbler.com/2.0/?',
		scrobbling_token: null,
		scrobbling_sessionID: null,
		scrobbling_min_length: 30000,
		scrobbling_min_percent: 0.5,

		lyrics_enabled: false,
//		lyrics_origins: ['https://*.google.com/*'],
		lyrics_providers: [],

		/*
		'songlyrics.com': function (response) {
		var div = document.createElement('div'); div.innerHTML = response.split('id="songLyricsDiv-outer">')[1].split('</div>')[0].trim(); return div.firstChild.innerHTML;
		},
		'metrolyrics.com': function (response) {
		return response.split('id="lyrics-body-text">')[1].split('</div>')[0];
		},
		'azlyrics.com': function (response) {
		return response.split('<!-- start of lyrics -->')[1].split('<!-- end of lyrics -->')[0].trim();
		}
		*/
		lyrics_filters: ['[\\(\\[](explicit|live|remastered)[^\\)]*[\\)\\]]'],

		debug: false
	}, settings = {};

	chrome.storage.onChanged.addListener(function (changes) {
		Object.keys(changes)
			.forEach(function (key) {
				settings[key] = changes[key].newValue;
			});
	});

	return {
		get: function (key) {
			return key in settings ? settings[key] : defaults[key];
		},
		set: function (key, value, callback) {
			var save = {};
			save[key] = value;

			chrome.storage.sync.set(save, callback);
		},
		getAll: function () {
			return extend({}, defaults, settings);
		},
		promise: new Promise(function (fulfill) {
			chrome.storage.sync.get(defaults, function (overrided) {
				settings = overrided;
				fulfill();
			});
		})
	};
});
