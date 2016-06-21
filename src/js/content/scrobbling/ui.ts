import { onLoad } from 'content/loader';
import * as templates from 'templates/content';
import 'styles/scrobbling.css!';
import * as logger from 'utils/logger';

let panel = document.createElement('div');
let wrapper = document.createElement('div');

panel.id = 'player-scrobbling-status';
panel.classList.add('hidden', 'chime-flex', 'chime-flex-vertical', 'chime-flex-center');

wrapper.id = 'player-right-scrobbling-wrapper';
wrapper.classList.add('chime-flex', 'chime-flex-1');

export function show() {
	panel.classList.remove('hidden');
}

export function hide() {
	panel.classList.add('hidden');
}

export function update(data) {
	panel.innerHTML = templates.scrobbling(data);
}

onLoad(() => {
	let rightWrapper = document.getElementById('material-player-right-wrapper');

	rightWrapper.parentNode.insertBefore(wrapper, rightWrapper);
	wrapper.appendChild(panel);
	wrapper.appendChild(rightWrapper);

	logger.info('added ui');
});
