export function stringify(params) {
	var x,
		parts = [];

	for (x in params) {
		parts.push(x + '=' + encodeURIComponent(params[x]));
	}

	return parts.join('&');
}
