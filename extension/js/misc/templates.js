define([
		'templates-root'
	],
	function (templates) {
		Object.keys(templates)
			.forEach(function (key) {
				var fn = templates[key];

				templates[key] = function (locals) {
					return fn(extend({
						i18n: chrome.i18n.getMessage.bind(chrome.i18n)
					}, locals));
				};
			});


		return templates;
	});