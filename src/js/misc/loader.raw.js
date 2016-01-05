(function () {
	function parse(name) {
		var parts = name.split(':');

		return {
			type: parts.shift(),
			module: parts.shift(),
			options: parts.slice(0)
		};
	}

	function css(url) {
		var link = document.createElement('link');

		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = url;

		document.querySelector('head').appendChild(link);

		return link;
	}

	define({
		normalize: function (name, normalize) {
			var parts = parse(name);

			return parts.type + ':' + normalize(parts.module) + (parts.options.length ? ':' + parts.options.join(':') : '');
		},
		load: function (name, req, onload, config) {
			var parts = parse(name);

			switch (parts.type) {
				case 'required':
					/**
					 * module is required and needs to be loaded after the settings init
					 */
					req(['settings'], function (settings) {
						settings.default.promise.then(function () {
							req([parts.module], onload);
						});
					});
					break;

				case 'optional':
					/**
					 * module is options and needs to be loaded after the settings init
					 * so that specific setting could be checked
					 */
					req(['settings'], function (settings) {
						settings.default.promise.then(function () {
							if (settings.default.get(parts.options[0])) {
								req([parts.module], onload);
							} else {
								onload(null);
							}
						});
					});
					break;

				case 'css':
					onload(css(chrome.runtime.getURL(parts.module)));
					break;
			}
		}
	});
})();
