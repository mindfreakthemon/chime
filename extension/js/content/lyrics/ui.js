define(['templates'], function (templates) {
	var button = document.createElement('a'),
		text = document.createElement('span'),
		container = document.createElement('div');

	text.innerText = 'Lyrics';
	text.classList.add('text');
	button.appendChild(text);
	button.setAttribute('id', 'chime-lyrics-button');
	button.classList.add('nav-item-container', 'tooltip');
	container.setAttribute('id', 'lyrics-container');
	container.innerHTML = templates.lyrics();

	var chimeLyrics = container.querySelector('#chime-lyrics'),
		chimeError = container.querySelector('#chime-error'),
		chimeLoading = container.querySelector('#chime-loading'),
		chimeSource = container.querySelector('#chime-source'),
		chimeSourceLink = container.querySelector('#chime-source-link');

	window.addEventListener('load', function () {
		var nav = document.getElementById('nav-content-container');

		document.getElementById('nav_collections').appendChild(button);
		nav.insertBefore(container, nav.firstChild);
	});

	function hideAll() {
		chimeLyrics.classList.remove('visible');
		chimeLoading.classList.remove('visible');
		chimeError.classList.remove('visible');
		chimeSource.classList.remove('visible');
	}

	return {
		container: container,
		button: button,

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
		},
		hideAll: hideAll
	};
});
