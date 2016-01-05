import settings from 'settings.js';
import templates from 'templates.js';

var providersList = document.getElementById('lyrics-providers'),
	host = document.getElementById('lyrics-host'),
	body = document.getElementById('lyrics-body'),
	add = document.getElementById('lyrics-button-add'),
	defaults = document.getElementById('lyrics-default-list'),
	clearPermissions = document.getElementById('lyrics-clear-permissions'),
	providers = settings.get('lyrics_providers'),
	providersOrigins = [];

providers
	.forEach(function (provider) {
		providersOrigins.push('http://*.' + provider[0] + '/*', 'https://*.' + provider[0] + '/*');
	});

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

defaults.addEventListener('click', function () {
	settings.remove('lyrics_providers', function () {
		location.reload();
	});
});

add.addEventListener('click', function () {
	if (!host.value || !body.value) {
		alert('all fields are required');
		return;
	}

	addHost(host.value, body.value);
	saveHosts();
});

clearPermissions.addEventListener('click', function () {
	chrome.runtime.sendMessage({
		permissions: {
			origins: providersOrigins
		},
		type: 'remove'
	}, function (removed) {
		location.reload();
	});
});
