define(['templates'], function (templates) {
	var menuItem = document.createElement('a');

	menuItem.id = 'chime-options-button';
	menuItem.classList.add('nav-item-container', 'tooltip');
	menuItem.setAttribute('data-type', 'chimeoptions');
	menuItem.innerHTML = templates.button({
		icon: 'settings',
		title: 'Chime Settings'
	});

	menuItem.addEventListener('click', function () {
		window.open(chrome.runtime.getURL('/pages/options.html'));
	});

	function load() {
		//var container = document.getElementById('extra-links-container');

		//container.addEventListener('click', function handler() {
		//	container.removeEventListener('click', handler);

			setTimeout(function () {
				var menu = document.querySelector('#nav .nav-section.material:last-child');


				menu.appendChild(menuItem);
			}, 100);
		//});
	}

	if (document.readyState === 'complete') {
		load();
	} else {
		window.addEventListener('load', load);
	}
});