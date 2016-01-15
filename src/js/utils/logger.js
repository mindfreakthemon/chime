/**
 * Smart logger.
 * @param arg0
 * @param argv
 */
export function info(arg0, ...argv) {
	let trace = null;

	try {
		throw new Error();
	} catch (e) {
		trace = e.stack.toString().split('\n')[2]
			.replace(chrome.extension.getURL('/js/'), '')
			.trim();
	}

	let args = [trace + ':' + (arg0 === undefined ? '' : ' ' + arg0)].concat(argv);

	console.log.apply(console, args.map(val => typeof val === 'string' ? val : val.toString()));
}
