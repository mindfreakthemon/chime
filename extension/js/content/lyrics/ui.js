define(['templates', 'loader!css:styles/lyrics.css'], function (templates) {
	var logger = getLogger('lyrics/ui');

	var button = document.createElement('a'),
		text = document.createElement('span'),
		container = document.createElement('div');

	text.innerText = 'Lyrics';
	text.classList.add('text');
	button.appendChild(text);
	button.setAttribute('id', 'chime-lyrics-button');
	button.classList.add('nav-item-container', 'tooltip', 'hidden');
	container.setAttribute('id', 'lyrics-container');
	container.innerHTML = templates.lyrics();

	var chimeLyrics = container.querySelector('#chime-lyrics'),
		chimeError = container.querySelector('#chime-error'),
		chimeLoading = container.querySelector('#chime-loading'),
		chimeSource = container.querySelector('#chime-source'),
		chimeSourceLink = container.querySelector('#chime-source-link');

	if (document.readyState === 'complete') {
		load();
	} else {
		window.addEventListener('load', load);
	}

	function load() {
		var nav = document.getElementById('nav-content-container');

		logger('lyrics button was added');

		document.getElementById('nav_collections').appendChild(button);
		nav.insertBefore(container, nav.firstChild);
	}

	function hideAll() {
		chimeLyrics.classList.remove('visible');
		chimeLoading.classList.remove('visible');
		chimeError.classList.remove('visible');
		chimeSource.classList.remove('visible');
	}

	return {
		container: container,
		button: button,

		toggle: function (enabled) {
			if (enabled) {
				button.classList.remove('hidden');
			} else {
				button.classList.add('hidden');
				container.classList.remove('visible');
			}
		},

		isShown: function () {
			return container.classList.contains('visible');
		},
		toggleShown: function () {
			container.classList.toggle('visible');
		},

		setLyrics: function (data) {
			chimeSourceLink.href = data.url;
			chimeSourceLink.innerText = data.host;
			chimeLyrics.innerHTML = data.content;
		},
		clearLyrics: function () {
			chimeLyrics.innerHTML = '';
		},

		showLyrics: function showLyrics() {
			hideAll();
			chimeLyrics.classList.add('visible');
			chimeSource.classList.add('visible');
		},
		showLoading: function showLoading() {
			hideAll();
			chimeLoading.classList.add('visible');
		},
		showError: function showError() {
			hideAll();
			chimeError.classList.add('visible');
		}
	};
});
