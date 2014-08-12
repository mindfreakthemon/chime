/**
 * This plugin loads modules if specified setting is set to true
 */
(function () {
	function parse(name) {
		var parts = name.split(':');

		return {
			setting: parts[0],
			module: parts[1]
		};
	}

	define({
		normalize: function (name, normalize) {
			var parts = parse(name);

			return parts.setting + ':' + normalize(parts.module);
		},
		load: function (name, req, onload, config) {
			var parts = parse(name);

			req(['settings'], function (settings) {
				settings.promise.then(function () {
					if (settings.get(parts.setting)) {
						req([parts.module], onload);
					} else {
						onload(null);
					}
				});
			});
		}
	});
})();
