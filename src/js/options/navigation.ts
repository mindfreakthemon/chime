let _array = Array.prototype;
let views = _array.slice.call(document.querySelector('.mainview').childNodes);
let links = _array.slice.call(document.querySelectorAll('.menu li'));

function scrollView(href) {
	let currentView = document.querySelector(href);
	let currentLink = document.querySelector('.menu a[href="' + href + '"]');

	_array.forEach.call(_array.concat.call(views, links), function (node) {
		if (node.nodeType !== 1) {
			return;
		}

		node.classList.remove('selected');
	});

	let parent = currentLink.parentElement;

	parent.classList.add('selected');
	currentView.classList.add('selected');

	document.documentElement.scrollTop = 0;
}

document.body.addEventListener('click', (e) => {
	let target = <HTMLElement> e.target;

	if (!target.matches('.menu a')) {
		return;
	}

	scrollView(target.getAttribute('href'));
});

window.addEventListener('popstate', () => {
	let hash = location.hash;

	if (hash.length > 1) {
		scrollView(hash);
	}
});

// if navigated directly or after the refresh
if (location.hash.length > 1) {
	scrollView(location.hash);
}

export {};
