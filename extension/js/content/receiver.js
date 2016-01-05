'use strict';

define(['track/track.factory', 'status/status.factory'], function (_track, _status) {
	var _track2 = _interopRequireDefault(_track);

	var _status2 = _interopRequireDefault(_status);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var logger = getLogger('receiver');
	logger('received enabled');

	function click(id) {
		var player = document.getElementById('player'),
		    event = new MouseEvent('click', {
			bubbles: true
		}),
		    el = player.querySelector('[data-id=' + id + ']');
		el.dispatchEvent(event);
		logger('executed click on %s', id);
	}

	function setPosition(position) {
		var slider = document.getElementById('slider'),
		    event = new MouseEvent('mousedown', {
			clientX: slider.offsetLeft + Math.ceil(slider.clientWidth * position / slider.getAttribute('aria-valuemax'))
		});
		slider.dispatchEvent(event);
		logger('executed setPosition on %d', position);
	}

	function receiver(request, sender, sendResponse) {
		logger('received command %s', request.command);

		switch (request.command) {
			case 'status':
				var data = {};

				try {
					data = Object.assign({}, data, _status2.default.extract());
				} catch (e) {}

				try {
					data = Object.assign({}, data, _track2.default.extract());
				} catch (e) {}

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
//# sourceMappingURL=receiver.js.map
