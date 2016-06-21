import * as logger from 'utils/logger';

import TrackFactory from 'content/track/track.factory';
import StatusFactory from 'content/status/status.factory';

type ButtonId = 'repeat' | 'play-pause' | 'forward' | 'rewind' | 'shuffle';

function click(id: ButtonId) {
	let player = document.getElementById('player');

	let event = new MouseEvent('click', {
		bubbles: true
	});

	let el = player.querySelector('[data-id=' + id + ']');

	el.dispatchEvent(event);

	logger.info('executed click on %s', id);
}

function setPosition(position) {
	let slider = document.getElementById('slider');
	let aria = parseInt(slider.getAttribute('aria-valuemax'), 10);

	let event = new MouseEvent('mousedown', {
		clientX: slider.offsetLeft +
		Math.ceil(slider.clientWidth * position / aria)
	});

	slider.dispatchEvent(event);

	logger.info('executed setPosition on %d', position);
}

function receiver(request, sender, sendResponse) {
	logger.info('received command %s', request.command);

	switch (request.command) {
		case 'status':
			let data = {};

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
