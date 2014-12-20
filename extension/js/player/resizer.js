define(function () {
	window.addEventListener('resize', function () {
		localStorage.setItem('chime:player:width', window.outerWidth);
		localStorage.setItem('chime:player:height', window.outerHeight);
	});

	var clientWidth = localStorage.getItem('chime:player:width'),
		clientHeight = localStorage.getItem('chime:player:height');

	if (clientWidth && clientHeight) {
		window.resizeTo(clientWidth, clientHeight);
	}
});