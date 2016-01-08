Promise.all([
		System.import('utils/storage.js')
	]).then(() => {
		System.import('content/transmitter/receiver.js');
		//System.import('content/transmitter/sender.js');
		System.import('content/options.js');
		System.import('content/player/logger.js');
		System.import('content/scrobbling/scrobbling.js');
		System.import('content/lyrics/lyrics.js');
		System.import('content/notifications/notifications.js');
		System.import('content/modifications/hero.js');
		//System.import('content/theme/theme.js');
	});
