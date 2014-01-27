(function (global) {
	global.Tab = {
		open: function (callback) {
			chrome.tabs.query({
				url: 'https://play.google.com/music/listen*'
			}, function (tabs) {
				if (tabs.length) {
					callback(tabs[0]);
					return;
				}

				if (Settings.getItem('open_new')) {
					chrome.tabs.create({
						index: 0,
						active: Settings.getItem('open_active'),
						pinned: Settings.getItem('open_pinned'),
						url: 'https://play.google.com/music/listen#/' + Settings.getItem('default_playlist')
					}, callback);
				}
			});
		}
	};
})(window);
