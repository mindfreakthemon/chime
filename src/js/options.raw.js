Promise.all([
		System.import('utils/storage.js'),
		System.import('options/body.js')
	])
	.then(() => {
		System.import('options/navigation.js');
		System.import('options/modals.js');
		System.import('options/form.js');
		System.import('options/scrobbling.js');
		System.import('options/lyrics.js');
	});
