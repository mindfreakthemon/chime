define(['theme/search'], function () {
	var logger = getLogger('theme');

	var doc = document.getElementById('doc');

	// remove height from doc
	window.addEventListener('load', function () {
		doc.style.height = '';
	});

	chrome.runtime.sendMessage({
		insertCSS: {
			file: 'styles/theme.css',
			runAt: 'document_start'
		}
	}, function () {
		logger('theme css loaded');
	});
});