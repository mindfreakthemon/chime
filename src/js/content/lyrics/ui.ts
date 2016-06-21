import { onLoad } from 'content/loader';
import * as templates from 'templates/content';
import 'styles/lyrics.css!';

let button = document.createElement('a');
let container = document.createElement('core-header-panel');

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

let chimeLyrics = container.querySelector('#chime-lyrics');
let chimeError = container.querySelector('#chime-error');
let chimeLoading = container.querySelector('#chime-loading');
let chimeSource = container.querySelector('#chime-source');
let chimeSourceLink = <HTMLAnchorElement> container.querySelector('#chime-source-link');

function hideAll() {
	chimeLyrics.classList.remove('visible');
	chimeLoading.classList.remove('visible');
	chimeError.classList.remove('visible');
	chimeSource.classList.remove('visible');
}

container.querySelector('.lyrics-container')
	.addEventListener('scroll', e => {
		let target = <HTMLDivElement> e.target;

		container.classList[target.scrollTop ? 'add' : 'remove']('shadowed');
	});

onLoad(() => {
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
			container.parentElement.classList.remove('chime-lyrics-visible');
		}
	},

	isShown: function () {
		return container.classList.contains('visible');
	},
	toggleShown: function () {
		container.classList.toggle('visible');
		container.parentElement.classList.toggle('chime-lyrics-visible');
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
