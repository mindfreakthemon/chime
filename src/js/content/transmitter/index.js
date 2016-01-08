import * as logger from 'utils/logger.js';

import TrackFactory from 'content/track/track.factory.js';
import StatusFactory from 'content/status/status.factory.js';

function click(id) {
	// request.id in ['repeat', 'play-pause', 'forward', 'rewind', 'shuffle']
	var player = document.getElementById('player'),
		event = new MouseEvent('click', {
			bubbles: true
		}),
		el = player.querySelector('[data-id=' + id + ']');
	el.dispatchEvent(event);

	logger.info('executed click on %s', id);
}

function setPosition(position) {
	var slider = document.getElementById('slider'),
		event = new MouseEvent('mousedown', {
			clientX: slider.offsetLeft +
				Math.ceil(slider.clientWidth * position / slider.getAttribute('aria-valuemax'))
		});
	slider.dispatchEvent(event);

	logger.info('executed setPosition on %d', position);
}

function receiver(request, sender, sendResponse) {
	logger.info('received command %s', request.command);

	switch (request.command) {
		case 'status':
			var data = {};

			try {
				data = Object.assign({}, data,
					StatusFactory.extract());
			} catch (e) {
				// no status
			}

			try {
				data = Object.assign({}, data,
					TrackFactory.extract());
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
