'use strict';

define(['settings', 'templates', 'body'], function (_settings, _templates) {
	var _settings2 = _interopRequireDefault(_settings);

	var _templates2 = _interopRequireDefault(_templates);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var providersList = document.getElementById('lyrics-providers'),
	    host = document.getElementById('lyrics-host'),
	    body = document.getElementById('lyrics-body'),
	    add = document.getElementById('lyrics-button-add'),
	    defaults = document.getElementById('lyrics-default-list'),
	    clearPermissions = document.getElementById('lyrics-clear-permissions'),
	    providers = _settings2.default.get('lyrics_providers'),
	    providersOrigins = [];

	providers.forEach(function (provider) {
		providersOrigins.push('http://*.' + provider[0] + '/*', 'https://*.' + provider[0] + '/*');
	});
	providersList.innerHTML = _templates2.default.lyrics({
		providers: providers
	});

	function removeHost(host) {
		var i = 0,
		    l = providers.length;

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
		_settings2.default.set('lyrics_providers', providers, function () {
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
		_settings2.default.remove('lyrics_providers', function () {
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
});
//# sourceMappingURL=lyrics.js.map
