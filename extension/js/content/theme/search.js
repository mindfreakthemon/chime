define([], function () {
	var logger = getLogger('theme/search');

	var searchBox = document.getElementById('gbqfw'),
		container = document.querySelector('#nav-container .music-banner');

	container.innerHTML = '';
	container.appendChild(searchBox);

	chrome.runtime.sendMessage({
		insertCSS: {
			file: 'styles/search.css',
			runAt: 'document_start'
		}
	}, function () {
		logger('search styles added');
	});
});
