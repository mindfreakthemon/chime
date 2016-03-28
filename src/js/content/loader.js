let onLoadPromise = new Promise(resolve => window.addEventListener('load', () => setTimeout(resolve, 100)));

export function onLoad(fn) {
	return onLoadPromise.then(fn);
}
