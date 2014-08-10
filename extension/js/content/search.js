define([], function () {
	var searchBox = document.getElementById('gbqfw'),
		container = document.querySelector('#nav-container .music-banner');

	container.innerHTML = '';
	container.appendChild(searchBox);
});
