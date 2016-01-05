'use strict';

define(['exports', 'templates', 'loader!css:styles/scrobbling.css'], function (exports, _templates) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.show = show;
	exports.hide = hide;
	exports.update = update;

	var _templates2 = _interopRequireDefault(_templates);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	let logger = getLogger('scrobbling/ui');
	let panel = document.createElement('div'),
	    wrapper = document.createElement('div');
	panel.id = 'player-scrobbling-status';
	panel.classList.add('hidden', 'chime-flex', 'chime-flex-vertical', 'chime-flex-center');
	wrapper.id = 'player-right-scrobbling-wrapper';
	wrapper.classList.add('chime-flex', 'chime-flex-1');

	function show() {
		panel.classList.remove('hidden');
	}

	function hide() {
		panel.classList.add('hidden');
	}

	function update(data) {
		panel.innerHTML = _templates2.default.scrobbling(data);
	}

	window.addEventListener('load', () => {
		var rightWrapper = document.getElementById('material-player-right-wrapper');
		rightWrapper.parentNode.insertBefore(wrapper, rightWrapper);
		wrapper.appendChild(panel);
		wrapper.appendChild(rightWrapper);
		logger('added ui');
	});
});
//# sourceMappingURL=ui.js.map
