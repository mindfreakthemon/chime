import * as logger from 'utils/logger.js';
import templates from 'templates/content.js';
import 'styles/lyrics.css!';

let button = document.createElement('a'),
	container = document.createElement('core-header-panel');

button.innerHTML = templates.button({
	icon: 'sj:music-note',
	title: 'Lyrics'
});
button.setAttribute('id', 'chime-lyrics-button');
button.classList.add('nav-item-container', 'tooltip', 'hidden');

container.setAttribute('id', 'lyrics-container');
container.setAttribute('mode', 'scroll');
container.setAttribute('main', 'true');
container.innerHTML = templates.lyrics();

let chimeLyrics = container.querySelector('#chime-lyrics'),
	chimeError = container.querySelector('#chime-error'),
	chimeLoading = container.querySelector('#chime-loading'),
	chimeSource = container.querySelector('#chime-source'),
	chimeSourceLink = container.querySelector('#chime-source-link');

function hideAll() {
	chimeLyrics.classList.remove('visible');
	chimeLoading.classList.remove('visible');
	chimeError.classList.remove('visible');
	chimeSource.classList.remove('visible');
}

container.querySelector('.lyrics-container')
	.addEventListener('scroll', (e) => {
		container.classList[e.target.scrollTop ? 'add' : 'remove']('shadowed');
	});

window.addEventListener('load', () => {
	document.getElementById('nav_collections').appendChild(button);
	document.querySelector('iron-selector [id=main]').parentNode.appendChild(container);
});

export default {
	container: container,
	button: button,

	toggle: function (enabled) {
		if (enabled) {
			button.classList.remove('hidden');
		} else {
			button.classList.add('hidden');
			container.classList.remove('visible');
			container.parentNode.classList.remove('chime-lyrics-visible');
		}
	},

	isShown: function () {
		return container.classList.contains('visible');
	},
	toggleShown: function () {
		container.classList.toggle('visible');
		container.parentNode.classList.toggle('chime-lyrics-visible');
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
