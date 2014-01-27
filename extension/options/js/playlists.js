Settings.promise.then(function () {
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
			pLists.appendChild(new Option(pL[1], 'pl/' + pL[5], false, 'pl/' + pL[5] === Settings.getItem('default_playlist')));
		});
	};

	xhr.send();
});
