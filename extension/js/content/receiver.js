define(['player'], function (player) {
	function click(id) {
		// request.id in ['repeat', 'play-pause', 'forward', 'rewind', 'shuffle']
		var player = document.getElementById('player'),
			event = new MouseEvent('click', {
				bubbles: true
			}),
			el = player.querySelector('[data-id=' + id + ']');
		el.dispatchEvent(event);

		console.log('executed click on %s', id);
	}

	function setPosition(position) {
		var slider = document.getElementById('slider'),
			event = new MouseEvent('mousedown', {
				clientX: slider.offsetLeft +
					Math.ceil(slider.clientWidth * position / slider.getAttribute('aria-valuemax'))
			});
		slider.dispatchEvent(event);

		console.log('executed setPosition on %d', position);
	}

	//noinspection JSUnusedLocalSymbols
	function receiver(request, sender, sendResponse) {
		switch (request.command) {
			case 'status':
				var data = {};

				try {
					data = extend({}, data,
						player.currentStatus());
				} catch (e) {
					// no status
				}

				try {
					data = extend({}, data,
						player.currentTrack());
				} catch (e) {
					// no track paying
				}

				sendResponse(data);
				break;
			case 'setPosition':
				setPosition(request.position);
				break;
			case 'click':
				click(request.id);
				break;
		}
	}

	chrome.runtime.onMessage.addListener(receiver);
});
