import templates from 'templates.js';

let menuItem = document.createElement('a');

menuItem.id = 'chime-options-button';
menuItem.classList.add('nav-item-container', 'tooltip');
menuItem.setAttribute('data-type', 'chimeoptions');
menuItem.innerHTML = templates.button({
	icon: 'settings',
	title: 'Chime Settings'
});

menuItem.addEventListener('click', () => {
	window.open(chrome.runtime.getURL('/pages/options.html'));
});

window.addEventListener('load', () => {
	setTimeout(() => document.querySelector('#nav .nav-section.material:last-child').appendChild(menuItem), 100);
});
