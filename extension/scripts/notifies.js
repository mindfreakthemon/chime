function runNotify(msg) {
	switch (msg.type) {
		case 'playing':
			if (settings.notify_playing) {
				var track = msg.track;
				notify(track.title, track.artist + ' - ' + track.album, track.cover);
			}

			break;
	}
}
