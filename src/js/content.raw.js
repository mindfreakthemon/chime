/*jshint -W024 */
Promise.all([
		System.import('utils/storage.js')
	])
	.then(([{ default: storage }]) => {
		storage.promise.then(() => {
			System.import('content/transmitter');

			System.import('content/options.js');

			if (storage.get('scrobbling_enabled')) {
				System.import('content/scrobbling');
			}

			if (storage.get('notify_enabled')) {
				System.import('content/notifications');
			}

			if (storage.get('lyrics_enabled')) {
				System.import('content/lyrics');
			}

			if (storage.get('hero_hidden')) {
				System.import('content/hero');
			}

			if (storage.get('theme_enabled')) {
				System.import('content/theme/theme.js');
			}
		});
	});
