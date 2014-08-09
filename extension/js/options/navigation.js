define(function () {
	var _array = Array.prototype,
		views = _array.slice.call(document.querySelector('.mainview').childNodes),
		links = _array.slice.call(document.querySelectorAll('.menu li'));

	function scrollView(href) {
		var currentView = document.querySelector(href),
			currentLink = document.querySelector('.menu a[href="' + href + '"]');

		_array.forEach.call(_array.concat.call(views, links), function (node) {
			if (node.nodeType !== 1) {
				return;
			}

			node.classList.remove('selected');
		});

		currentLink.parentNode.classList.add('selected');
		currentView.classList.add('selected');

		document.documentElement.scrollTop = 0;
	}

	document.body.addEventListener('click', function (e) {
		if (!e.target.webkitMatchesSelector('.menu a')) {
			return;
		}

		scrollView(e.target.getAttribute('href'));
	});

	window.addEventListener('popstate', function (e) {
		var hash = location.hash;

		if (hash.length > 1) {
			scrollView(hash);
		}
	});

	// if navigated directly or after the refresh
	if (location.hash.length > 1) {
		scrollView(location.hash);
	}
});
