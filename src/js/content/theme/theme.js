import storage from 'utils/storage.js';

const THEME_ENABLED = storage.get('theme_enabled');

if (THEME_ENABLED) {
	System.import('styles/theme.css!');

	var doc = document.getElementById('doc');

	window.addEventListener('load', () => {
		doc.style.height = '';
	});
}
