let frame = <HTMLIFrameElement> document.getElementById('sandbox');
let hash = {};

window.addEventListener('message', e => {
	if (e.data.id in hash) {
		let callback = hash[e.data.id];

		// empty hash val
		delete hash[e.data.id];

		// run callback
		callback(e.data);
	}
});

export default function (message, callback) {
	if (!message.id) {
		message.id = Date.now() + '' + Math.random();
	}

	hash[message.id] = callback;

	frame.contentWindow.postMessage(message, '*');
}
