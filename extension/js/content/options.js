'use strict';

define(['templates'], function (_templates) {
	var _templates2 = _interopRequireDefault(_templates);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	let menuItem = document.createElement('a');
	menuItem.id = 'chime-options-button';
	menuItem.classList.add('nav-item-container', 'tooltip');
	menuItem.setAttribute('data-type', 'chimeoptions');
	menuItem.innerHTML = _templates2.default.button({
		icon: 'settings',
		title: 'Chime Settings'
	});
	menuItem.addEventListener('click', () => {
		window.open(chrome.runtime.getURL('/pages/options.html'));
	});
	window.addEventListener('load', () => {
		setTimeout(() => document.querySelector('#nav .nav-section.material:last-child').appendChild(menuItem), 100);
	});
});
//# sourceMappingURL=options.js.map
