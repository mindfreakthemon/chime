export function stringify(params) {
	let x;
	let parts = [];

	Object.keys(params)
		.forEach((key) => parts.push(x + '=' + encodeURIComponent(params[x])));

	return parts.join('&');
}
