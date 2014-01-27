(function (global) {
	var defaults = {
		debug: false,

		click_action: 'popup',

		open_new: true,
		open_active: false,
		open_pinned: true,

		default_playlist: 'all',
		native_hot_keys: false,

		notify_resumed: true,
		notify_playing: true,
		notify_paused: false,
		notify_stopped: false,
		notify_finished: false,

		scrobbling_enabled: false,
		scrobbling_now_playing: true,
		scrobbling_notify: false,
		scrobbling_api_secret: '672707041194c804c5973e54fb4ee520',
		scrobbling_api_key: '74639aa1297c3397d80d934196f1e542',
		scrobbling_api_url: 'https://ws.audioscrobbler.com/2.0/?',
		scrobbling_token: null,
		scrobbling_sessionID: null,
		scrobbling_min_length: 30000,
		scrobbling_min_percent: 0.5,

		lyrics_enabled: true
	}, settings = {};

	chrome.storage.onChanged.addListener(function (changes) {
		Object.keys(changes)
			.forEach(function (key) {
				settings[key] = changes[key].newValue;
			});
	});

	global.Settings = {
		getItem: function (key) {
			return key in settings ? settings[key] : defaults[key];
		},
		setItem: function (key, value) {
			var save = {};
			save[key] = value;

			chrome.storage.sync.set(save);
		},
		getItems: function () {
			return settings
		},
		promise: new Promise(function (fulfill) {
			chrome.storage.sync.get(defaults, function (overrided) {
				settings = overrided;
				fulfill();
			});
		})
	}
})(window);
