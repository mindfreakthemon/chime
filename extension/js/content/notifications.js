define(['events', 'settings'], function (events, settings) {
	var logger = getLogger('notifications'),
		clearer = {};

	function clear(id) {
		chrome.runtime.sendMessage({
			notification: 'chime-notification-' + id
		}, function () {

		});
	}

	function notify(type, params) {
		if (clearer[type]) {
			clearTimeout(clearer[type]);
			delete clearer[type];
		}

		params.iconUrl = params.iconUrl || settings.get('default_icon');

		chrome.runtime.sendMessage({
			id: 'chime-notification-' + type,
			type: 'create',
			notifications: params
		}, function () {
			clearer[type] = setTimeout(clear.bind(null, type), 3000);
		});
	}

	events.addEventListener('chime-playing', function (e) {
		var track = e.detail.playingTrack;

		if (settings.get('notify_playing')) {
			logger(e.type, e);

			notify('play-pause', {
				type: 'basic',
				iconUrl: track.cover,
				title: track.title,
				message: track.artist + ' - ' + track.album
			});
		}
	});

	events.addEventListener('chime-resumed', function (e) {
		var track = e.detail.playingTrack;

		if (settings.get('notify_resumed')) {
			logger(e.type, e);

			notify('play-pause', {
				type: 'progress',
				iconUrl: track.cover,
				title: track.title,
				message: track.artist + ' - ' + track.album,
				progress: Math.round(100 * track.position / track.duration)
			});
		}
	});

	events.addEventListener('chime-seeking', function (e) {
		var track = e.detail.playingTrack;

		if (settings.get('notify_seeking')) {
			logger(e.type, e);

			notify('play-pause', {
				type: 'progress',
				iconUrl: track.cover,
				title: track.title,
				message: track.artist + ' - ' + track.album,
				progress: Math.round(100 * track.position / track.duration)
			});
		}
	});

	events.addEventListener('chime-paused', function (e) {
		var track = e.detail.playingTrack;

		if (settings.get('notify_paused')) {
			logger(e.type, e);

			notify('play-pause', {
				type: 'progress',
				iconUrl: track.cover,
				title: 'Paused: ' + track.title,
				message: track.artist + ' - ' + track.album,
				progress: Math.round(100 * track.position / track.duration)
			});
		}
	});

	events.addEventListener('chime-stopped', function (e) {
		var track = e.detail.playingTrack;

		if (settings.get('notify_stopped')) {
			logger(e.type, e);

			notify('stop', {
				type: 'basic',
				iconUrl: track.cover,
				title: 'Stopped: ' + track.title,
				message: track.artist + ' - ' + track.album
			});
		}
	});

	events.addEventListener('chime-finished', function (e) {
		if (settings.get('notify_finished')) {
			logger(e.type, e);

			notify('finish', {
				type: 'basic',
				title: 'Playlist has ended!',
				message: 'No more songs to play.'
			});
		}
	});
});
