'use strict';

define(['exports', '../templates/content'], function (exports, _content) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _content2 = _interopRequireDefault(_content);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	Object.keys(_content2.default).forEach(function (key) {
		var fn = _content2.default[key];

		_content2.default[key] = function (locals) {
			return fn(Object.assign({
				i18n: chrome.i18n.getMessage.bind(chrome.i18n)
			}, locals));
		};
	});
	exports.default = _content2.default;
});
//# sourceMappingURL=templates.js.map
