import storage from 'utils/storage';
import * as templates from 'templates/options';

let providersList = document.getElementById('lyrics-providers');
let host = <HTMLInputElement> document.getElementById('lyrics-host');
let body = <HTMLInputElement> document.getElementById('lyrics-body');
let add = document.getElementById('lyrics-button-add');
let defaults = document.getElementById('lyrics-default-list');
let clearPermissions = document.getElementById('lyrics-clear-permissions');
let providers = storage.get('lyrics_providers');
let providersOrigins = [];

providers
	.forEach(function (provider) {
		providersOrigins.push('http://*.' + provider[0] + '/*', 'https://*.' + provider[0] + '/*');
	});

providersList.innerHTML = templates.lyrics({
	providers: providers
});

function removeHost(host) {
	let i = 0, l = providers.length;

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
	storage.set('lyrics_providers', providers, () => {
		location.reload();
	});
}

providersList.addEventListener('click', e => {
	e.preventDefault();

	let target = <HTMLElement> e.target;

	if (target.classList.contains('delete')) {
		removeHost(target.dataset['host']);
		saveHosts();
	}
});

defaults.addEventListener('click', () => {
	storage.remove('lyrics_providers', () => {
		location.reload();
	});
});

add.addEventListener('click', () => {
	if (!host.value || !body.value) {
		alert('all fields are required');
		return;
	}

	addHost(host.value, body.value);
	saveHosts();
});

clearPermissions.addEventListener('click', () => {
	chrome.runtime.sendMessage({
		permissions: {
			origins: providersOrigins
		},
		type: 'remove'
	}, removed => location.reload());
});
