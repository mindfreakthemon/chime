'use strict';

define(['settings'], function (_settings) {
	var _settings2 = _interopRequireDefault(_settings);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	chrome.runtime.onInstalled.addListener(function (details) {
		var providers;

		if (details.reason === 'app_update') {
			providers = _settings2.default.get('lyrics_providers');
			providers.forEach(function (data) {
				if (data[0] === 'azlyrics.com') {
					data[1] = "return response.split('<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->')[1].split('<!-- MxM banner -->')[0].trim();";
				}
			});

			_settings2.default.set('lyrics_providers', providers);
		}
	});
});
//# sourceMappingURL=update.js.map
