define(['templates'], function (templates) {
	var menuItem = document.createElement('div');

	menuItem.id = 'chime-options-button';
	menuItem.classList.add('goog-menuitem');
	menuItem.setAttribute('role', 'menuitem');
	menuItem.innerHTML = templates.options();

	menuItem.addEventListener('click', function () {
		window.open(chrome.runtime.getURL('/pages/options.html'));
	});

	function load() {
		var container = document.getElementById('extra-links-container');

		container.addEventListener('click', function handler() {
			container.removeEventListener('click', handler);

			setTimeout(function () {
				var menu = document.querySelector('.goog-menu.goog-menu-vertical.extra-links-menu');


				menu.appendChild(menuItem);
			}, 100);
		});
	}

	if (document.readyState === 'complete') {
		load();
	} else {
		window.addEventListener('load', load);
	}
});