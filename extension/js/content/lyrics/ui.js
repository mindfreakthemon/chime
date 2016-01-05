'use strict';

define(['exports', 'templates', 'loader!css:styles/lyrics.css'], function (exports, _templates) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _templates2 = _interopRequireDefault(_templates);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var logger = getLogger('lyrics/ui');
	var button = document.createElement('a'),
	    container = document.createElement('core-header-panel');
	button.innerHTML = _templates2.default.button({
		icon: 'sj:music-note',
		title: 'Lyrics'
	});
	button.setAttribute('id', 'chime-lyrics-button');
	button.classList.add('nav-item-container', 'tooltip', 'hidden');
	container.setAttribute('id', 'lyrics-container');
	container.setAttribute('mode', 'scroll');
	container.setAttribute('main', 'true');
	container.innerHTML = _templates2.default.lyrics();
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
		logger('lyrics button was added');
		document.getElementById('nav_collections').appendChild(button);
		document.getElementById('drawer-panel').appendChild(container);
	}

	function hideAll() {
		chimeLyrics.classList.remove('visible');
		chimeLoading.classList.remove('visible');
		chimeError.classList.remove('visible');
		chimeSource.classList.remove('visible');
	}

	exports.default = {
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
//# sourceMappingURL=ui.js.map
