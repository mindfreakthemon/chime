Promise.all([
		System.import('utils/storage'),
		System.import('options/body')
	])
	.then(([storage]) => storage.default.promise)
	.then(() => {
		System.import('options/navigation');
		System.import('options/modals');
		System.import('options/form');
		System.import('options/scrobbling');
		System.import('options/lyrics');
	});
