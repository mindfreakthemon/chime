'use strict';

define(['exports', 'templates-root'], function (exports, _templatesRoot) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _templatesRoot2 = _interopRequireDefault(_templatesRoot);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	Object.keys(_templatesRoot2.default).forEach(function (key) {
		var fn = _templatesRoot2.default[key];

		_templatesRoot2.default[key] = function (locals) {
			return fn(Object.assign({
				i18n: chrome.i18n.getMessage.bind(chrome.i18n)
			}, locals));
		};
	});
	exports.default = _templatesRoot2.default;
});
//# sourceMappingURL=templates.js.map
