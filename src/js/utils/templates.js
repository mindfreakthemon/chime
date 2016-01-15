export default function decorate(fn) {
	return function (locals) {
		return fn(Object.assign({
			i18n: chrome.i18n.getMessage.bind(chrome.i18n)
		}, locals));
	};
}
