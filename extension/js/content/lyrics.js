define(['player', 'events', 'settings', 'jade!templates/lyrics'], function (player, events, settings, lyrics_tpl) {
	// @TODO refine this stuff
	var button = document.createElement('a'),
		text = document.createElement('span'),
		lyrics = document.createElement('div');

	text.innerText = 'Lyrics';
	text.classList.add('text');
	button.appendChild(text);
	button.setAttribute('id', 'chime-lyrics-button');
	button.classList.add('nav-item-container', 'tooltip');
	lyrics.setAttribute('id', 'lyrics-container');
	lyrics.innerHTML = lyrics_tpl();

	// @TODO make this configurable
	var lyricsProviders = {
			'songlyrics.com': function (response) {
				var div = document.createElement('div');
				div.innerHTML = response.split('id="songLyricsDiv-outer">')[1].split('</div>')[0].trim();

				return div.firstChild.innerHTML;
			},
			'metrolyrics.com': function (response) {
				return response.split('id="lyrics-body-text">')[1].split('</div>')[0];
			},
			'azlyrics.com': function (response) {
				return response.split('<!-- start of lyrics -->')[1].split('<!-- end of lyrics -->')[0].trim();
			}
		},
		lyricsProvidersQuery = Object.keys(lyricsProviders)
			.map(function (key) {
				return 'site:' + key;
			})
			.join(' OR ');

	button.addEventListener('click', function () {
		var enabled = lyrics.classList.contains('visible');

		chrome.runtime.sendMessage({
			permissions: {
				origins: Object.keys(lyricsProviders).map(function (v) {
					return 'http://*.' + v + '/*';
				})
			},
			type: enabled ? 'remove' : 'request'
		}, function (granted) {
			if (!granted) {
				return;
			}

			lyrics.classList.toggle('visible');

			if (!enabled) {
				loadLyrics();
			}
		});
	});

	function loadLyrics() {
		var chimeLyrics = document.getElementById('chime-lyrics'),
			chimeError = document.getElementById('chime-error'),
			chimeLoading = document.getElementById('chime-loading'),
			chimeSource = document.getElementById('chime-source'),
			chimeSourceLink = document.getElementById('chime-source-link'),
			track = player.currentTrack();

		function showLoading() {
			hideAll();
			chimeLoading.classList.add('visible');
		}

		function showError() {
			hideAll();
			chimeError.classList.add('visible');
		}

		function showLyrics() {
			hideAll();
			chimeLyrics.classList.add('visible');
			chimeSource.classList.add('visible');
		}

		function hideAll() {
			chimeLyrics.classList.remove('visible');
			chimeLoading.classList.remove('visible');
			chimeError.classList.remove('visible');
			chimeSource.classList.remove('visible');
		}

		if (!track.title || !track.artist) {
			showError();
			return;
		}

		showLoading();
		chimeLyrics.innerHTML = '';

		var xhr = new XMLHttpRequest(),
			params = {
				hl: 'en',
				q: track.title + ' ' + track.artist + ' Lyrics AND (' + lyricsProvidersQuery + ')'
			};

		xhr.open('GET', 'https://www.google.com/search?' + queryString(params));
		xhr.onload = function () {
			var response = xhr.responseText,
				url,
				host;

			try {
				url = response.split(' id="search"')[1].split('<a href="')[1].split('"')[0];
				host = url.match(/^https?:\/\/(?:www\.)?([^\/]+)/i)[1];
			} catch (e) {
				console.log('error parsing query results: %s', e.message);
				showError();
				return;
			}

			chrome.runtime.sendMessage({
				url: url
			}, function (data) {
				var text;

				try {
					text = lyricsProviders[host](data.response);
				} catch (e) {
					console.log('error parsing lyrics on %s: %s', host, e.message);
					showError();
					return;
				}

				chimeSourceLink.href = url;
				chimeSourceLink.innerText = host;
				chimeLyrics.innerHTML = text;
				showLyrics();
			});
		};

		xhr.send();
	}

	window.addEventListener('load', function () {
		var container = document.getElementById('nav-content-container');

		settings.promise.then(function () {
			if (settings.get('lyrics_enabled')) {
				document.getElementById('nav_collections').appendChild(button);
				container.insertBefore(lyrics, container.firstChild);
			}
		});
	});

	events.addEventListener('chime-playing', function () {
		if (lyrics.classList.contains('visible')) {
			loadLyrics();
		}
	});
});
