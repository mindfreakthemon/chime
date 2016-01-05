import templates from '../templates/content';

Object.keys(templates)
	.forEach(function (key) {
		var fn = templates[key];

		templates[key] = function (locals) {
			return fn(Object.assign({
				i18n: chrome.i18n.getMessage.bind(chrome.i18n)
			}, locals));
		};
	});

export default templates;
