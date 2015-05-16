define(['templates', 'loader!css:styles/scrobbling.css'], function (templates) {
	var logger = getLogger('scrobbling/ui');

	var panel = document.createElement('div'),
		wrapper = document.createElement('div');

	panel.id = 'player-scrobbling-status';
	panel.classList.add('hidden', 'flex', 'flex-vertical', 'flex-center');

	wrapper.id = 'player-right-scrobbling-wrapper';
	wrapper.classList.add('flex', 'flex-1');

	function show() {
		panel.classList.remove('hidden');
	}

	function hide() {
		panel.classList.add('hidden');
	}

	function update(data) {
		panel.innerHTML = templates.scrobbling(data);
	}

	function load() {
		var rightWrapper = document.getElementById('material-player-right-wrapper');

		rightWrapper.parentNode.insertBefore(wrapper, rightWrapper);
		wrapper.appendChild(panel);
		wrapper.appendChild(rightWrapper);

		logger('added ui');
	}

	if (document.readyState === 'complete') {
		load();
	} else {
		window.addEventListener('load', load);
	}

	return {
		show: show,
		hide: hide,
		toggle: function (val) {
			if (val) {
				show();
			} else {
				hide();
			}
		},
		update: update
	};
});