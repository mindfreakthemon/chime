define(['theme/search', 'loader!css:styles/theme.css'], function () {
	var doc = document.getElementById('doc');

	// remove height from doc
	window.addEventListener('load', function () {
		doc.style.height = '';
	});
});