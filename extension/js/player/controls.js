define(['requester', 'settings'], function (requester, settings) {
	var logger = getLogger('controls');

	function _strpad(str, len, pad) {
		str = '' + str;

		while (str.length < len) {
			str = pad + str;
		}

		return str;
	}

	function _convertToTime(msec) {
		var secf = msec / 1000,
			sec = Math.floor(secf % 60),
			minf = secf / 60,
			min = Math.floor(minf);

		return min + ':' + _strpad(sec, 2, '0');
	}

	var controls = document.getElementById('controls'),
		widget = document.getElementById('widget'),
		loading = document.getElementById('loading');

	controls.addEventListener('click', function (e) {
		e.stopPropagation();

		var self = closest(e.target, 'button');

		if (self &&
			self.dataset.command) {
			requester.send({
				command: 'click',
				id: self.dataset.command
			});
		}
	});

	var initial = true,

		track = document.getElementById('track'),
		track_title = document.getElementById('track-title'),
		track_artist = document.getElementById('track-artist'),
		track_cover = document.getElementById('track-cover'),

		play_icon = document.getElementById('play-icon'),
		rewind_icon = document.getElementById('rewind-icon'),
		forward_icon = document.getElementById('forward-icon'),
		shuffle_icon = document.getElementById('shuffle-icon'),
		repeat_icon = document.getElementById('repeat-icon'),

		range_control = document.getElementById('range-control'),
		position_value = document.getElementById('position-value'),
		duration_value = document.getElementById('duration-value');

	function update_widget(status) {
		if (!status) {
			return;
		}

		if (status.title) {
			track.classList.remove('hidden');

			track_title.innerText = status.title;
			track_artist.innerText = status.artist;
		} else {
			track.classList.add('hidden');
		}

		if (status.cover) {
			track_cover.parentNode.classList.remove('hidden');
			track_cover.src = status.cover;
		} else {
			track_cover.parentNode.classList.add('hidden');
		}

		play_icon.classList.remove('glyphicon-play', 'glyphicon-pause');
		play_icon.classList.add(status.playing ? 'glyphicon-pause' : 'glyphicon-play');
		play_icon.parentNode.title = status.playing ? 'Pause' : 'Play';
		play_icon.parentNode.disabled = !status.play_enabled;

		forward_icon.parentNode.disabled = !status.forward_enabled;
		rewind_icon.parentNode.disabled = !status.rewind_enabled;

		switch (status.shuffle) {
			case 'DISABLED':
				shuffle_icon.disabled = true;
				break;
			case 'NO_SHUFFLE':
				shuffle_icon.disabled = false;
				shuffle_icon.classList.add('disabled');
				break;
			case 'ALL_SHUFFLE':
				shuffle_icon.disabled = false;
				shuffle_icon.classList.remove('disabled');
				break;
		}

		switch (status.repeat) {
			case 'NO_REPEAT':
				repeat_icon.classList.remove('glyphicon-repeat');
				repeat_icon.classList.add('glyphicon-retweet', 'disabled');
				break;
			case 'LIST_REPEAT':
				repeat_icon.classList.remove('glyphicon-repeat', 'disabled');
				repeat_icon.classList.add('glyphicon-retweet');
				break;
			case 'SINGLE_REPEAT':
				repeat_icon.classList.remove('glyphicon-retweet', 'disabled');
				repeat_icon.classList.add('glyphicon-repeat');
				break;
		}

		if (initial) {
			loading.classList.add('hidden');
			widget.classList.remove('hidden');
			controls.classList.remove('hidden');
			range_control.max = status.duration;
			duration_value.innerText = _convertToTime(status.duration);
		}

		range_control.value = status.position;
		position_value.innerText = _convertToTime(status.position);
	}

	range_control.addEventListener('change', function (e) {
		requester.send({
			command: 'setPosition',
			position: range_control.value
		});
	});

	var album_art_action = settings.get('player_album_art_action');

	logger('album art action set to %s', album_art_action);

	console.log(album_art_action);

	track_cover.addEventListener('click', function () {
		switch (album_art_action) {
			case 'navigate':
					requester.activate();
			/* fall through */
			case 'close':
				window.close();
				break;
		}
	});

	if (album_art_action !== 'nothing') {
		track_cover.classList.add('clickable');
	}

	requester.onStatus.addListener(update_widget);
});