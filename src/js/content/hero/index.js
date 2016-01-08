import storage from 'utils/storage.js';

const HERO_HIDDEN = storage.get('hero_hidden');

if (HERO_HIDDEN) {
	System.import('styles/hero.css!');

	var cc = document.getElementById('content-container');

	cc.classList.remove('has-hero-image');
}

