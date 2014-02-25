Settings.promise.then(function () {
	var logger = getLogger('lyrics');

	var buttons = document.getElementById('action_bar_container'),
		container = document.getElementById('nav-content-container'),
		button = document.createElement('button'),
		text = document.createElement('span'),
		lyrics = document.createElement('div');

	text.innerText = 'Lyrics';
	text.classList.add('text');
	button.appendChild(text);
	button.setAttribute('id', 'chime-lyrics-button');
	button.classList.add('button', 'small', 'primary');

	lyrics.setAttribute('id', 'lyrics-container');

	function loadTemplate() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', chrome.runtime.getURL('content/html/lyrics.html'));
		xhr.onload = function () {
			lyrics.innerHTML = xhr.responseText;

			button.addEventListener('click', function () {
				container.classList.toggle('chime-visible');

				if (container.classList.contains('chime-visible')) {
					loadLyrics();
				}
			});
		};

		xhr.send();
	}

	function showHideButton() {
		var toggle = !Settings.getItem('lyrics_enabled');

		button.classList.toggle('hidden', toggle);
		container.classList.toggle('hidden', toggle);

		if (!toggle) {
			container.classList.remove('chime-visible');
		}
	}

	// @TODO make this configurable
	var lyricsProviders = {
			'songlyrics.com': function (response) {
				var div = document.createElement('div');
				div.innerHTML = response.split('id="songLyricsDiv-outer">')[1].split('</div>')[0].trim();

				return div.firstChild.innerHTML;
			},
			'metrolyrics.com': function (response) {
				return response.split('id="lyrics-body-text">')[1].split('</div>')[0];
			}
		},
		lyricsProvidersQuery = Object.keys(lyricsProviders)
			.map(function (key) {
				return 'site:' + key;
			})
			.join(' OR ');

	function loadLyrics() {
		var chimeLyrics = document.getElementById('chime-lyrics'),
			chimeError = document.getElementById('chime-error'),
			chimeLoading = document.getElementById('chime-loading'),
			chimeSource = document.getElementById('chime-source'),
			chimeSourceLink = document.getElementById('chime-source-link'),
			track = currentTrack();

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

		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://www.google.com/search?q=' +
			encodeURIComponent(track.title + ' ' + track.artist + ' Lyrics AND (' + lyricsProvidersQuery + ')'));
		xhr.onload = function () {
			var response = xhr.responseText,
				url,
				host;

			try {
				url = response.split(' id="search"')[1].split('<a href="')[1].split('"')[0];
				host = url.match(/^https?:\/\/(?:www\.)?([^\/]+)/i)[1];
			} catch (e) {
				logger('error parsing query results: %s', e.message);
				showError();
				return;
			}

			var xhr2 = new XMLHttpRequest();
			xhr2.onload = function () {
				var response = xhr2.responseText,
					text;

				try {
					text = lyricsProviders[host](response);
				} catch (e) {
					logger('error parsing lyrics on %s: %s', host, e.message);
					showError();
					return;
				}

				chimeSourceLink.href = url;
				chimeSourceLink.innerText = host;
				chimeLyrics.innerHTML = text;
				showLyrics();
			};
			xhr2.open('GET', url, true);
			xhr2.send();
		};

		xhr.send();
	}

	setTimeout(function () {
		loadTemplate();
		buttons.appendChild(button);
		container.insertBefore(lyrics, container.firstChild);
		showHideButton();
	}, 5000);

	bindEvent('chime-playing', function (e) {
		if (container.classList.contains('chime-visible')) {
			loadLyrics();
		}
	});

	chrome.storage.onChanged.addListener(showHideButton);
});
