
/**
 * Form change event
 */
(function () {
	var form = document.querySelector('#form');

	// set inputs according to current settings
	deobjectify(form, settings);

	form.addEventListener('change', function (e) {
		var data = objectify(form);

		// convert
		data.open_new = !!data.open_new;
		data.open_active = !!data.open_active;
		data.open_pinned = !!data.open_pinned;
		data.native_hot_keys = !!data.native_hot_keys;

		localStorage.options = JSON.stringify(data);

		notify('Chime settings', 'All settings were saved!', 1000);
	});

	// insert custom browser hotkeys
	chrome.commands.getAll(function (hotkeys) {
		hotkeys.forEach(function (hotkey) {
			var command = hotkey.name
					.split(':')
					.filter(function (v) {
						return v;
					})
					.join('-'),
				dl = document.querySelector('#command-' + command);

			if (dl) {
				var dt = document.createElement('dt');
				dt.innerText = hotkey.shortcut;

				dl.insertBefore(dt, dl.firstChild);
			}
		});
	});
})();

/**
 * Loading personal playlists into def pl select
 */
(function () {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', 'https://play.google.com/music/listen?u=0', true);
	xhr.onload = function () {
		var response = xhr.responseText,
			pLists = document.getElementById('personal-playlists'),
			array = [];

		response = response.slice(response.indexOf('window[\'USER_CONTEXT\']'));
		response = response.slice(0, response.indexOf('window[\'initialPreferences\']'));
		response = response.slice(24);
		response = response.slice(0, -2);
		response = response.trim();
		response = response.slice(response.indexOf('[', 1));
		response = response.slice(0, response.search(/]\s+]/));
		response = response + ']]';
		response = response.replace(/\r?\n/g, '');
		response = response.replace(/,{2,}/g, ',');

		try {
			array = JSON.parse(response);
		} catch (e) {}

		if (!array.length) {
			pLists.parentNode.removeChild(pLists);
			return;
		}

		pLists.innerHTML = '';

		array.forEach(function (pL) {
			pLists.appendChild(new Option(pL[1], 'pl/' + pL[5], false, 'pl/' + pL[5] === settings.default_playlist));
		});
	};

	xhr.send();
})();

/**
 * Navigation
 */
(function () {
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
})();

/**
 * Last.fm stuff
 */
(function () {
	// last-fm stuff
	chrome.runtime.sendMessage({
		command: 'scrobbling',
		type: 'profile'
	}, function (user) {
		if (user) {
			var image = document.querySelector('#last-fm-user-image'),
				username = document.querySelector('#last-fm-user-name');

			username.innerText = user.name;
			image.src = user.image[1]['#text'];

			document.getElementById('last-fm-profile').removeAttribute('hidden');
		} else {
			document.getElementById('last-fm-not-connected').removeAttribute('hidden');
		}
	});

	document.getElementById('last-fm-disconnect')
		.addEventListener('click', function () {
			localStorage.removeItem('sessionID');
			localStorage.removeItem('token');
			location.reload();
		});

	document.getElementById('last-fm-connect')
		.addEventListener('click', function () {
			chrome.runtime.sendMessage({
				command: 'scrobbling',
				type: 'authorize'
			}, function () {
				location.reload();
			});
		});
})();
