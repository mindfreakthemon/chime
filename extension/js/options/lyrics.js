define(['settings', 'templates'], function (settings, templates) {
	var providersList = document.getElementById('lyrics-providers'),
		host = document.getElementById('lyrics-host'),
		body = document.getElementById('lyrics-body'),
		add = document.getElementById('lyrics-button-add'),
		providers = settings.get('lyrics_providers');

	providersList.innerHTML = templates.lyrics({
		providers: providers
	});

	function removeHost(host) {
		var i = 0, l = providers.length;

		for (; i < l; i++) {
			if (providers[i][0] === host) {
				providers.splice(i, 1);
				break;
			}
		}
	}

	function addHost(host, body) {
		providers.push([host, body]);
	}

	function saveHosts() {
		settings.set('lyrics_providers', providers, function () {
			location.reload();
		});
	}

	providersList.addEventListener('click', function (e) {
		e.preventDefault();

		var target = e.target;

		if (target.classList.contains('delete')) {
			removeHost(target.dataset.host);
			saveHosts();
		}
	});

	add.addEventListener('click', function () {
		if (!host.value || !body.value) {
			alert('all fields are required');
			return;
		}

		addHost(host.value, body.value);
		saveHosts();
	});
});
