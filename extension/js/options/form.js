'use strict';

define(['settings', 'body'], function (_settings) {
	var _settings2 = _interopRequireDefault(_settings);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var form = document.getElementById('form');
	form.addEventListener('change', function (e) {
		var data = objectify(form);
		chrome.storage.sync.set(data, function () {});
	});
	document.getElementById('debug-reset').addEventListener('click', function () {
		chrome.storage.sync.clear();
		location.reload();
	});
	deobjectify(form, _settings2.default.getAll());
});
//# sourceMappingURL=form.js.map
