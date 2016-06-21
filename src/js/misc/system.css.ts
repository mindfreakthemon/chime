let head = document.getElementsByTagName('head')[0];

let linkHrefs = [];

for (let link of document.getElementsByTagName('link')) {
	linkHrefs.push(link.href);
}

export function fetch(load) {
	for (let i = 0; i < linkHrefs.length; i++) {
		if (load.address === linkHrefs[i]) {
			return Promise.resolve('');
		}
	}

	return new Promise((resolve, reject) => {
		let link = document.createElement('link');

		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = load.address;

		link.onload = () => resolve();
		link.onerror = (event) => reject(event['error']);

		head.appendChild(link);
	});
}
