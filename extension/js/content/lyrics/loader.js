define(['settings'], function (settings) {
	var logger = getLogger('lyrics/loader');

	var filters = settings.get('lyrics_filters'),
		providers = settings.get('lyrics_providers'),
		providersHash = {},
		providersKeys = [],
		providersQuery = [];

	providers
		.forEach(function (provider) {
			providersHash[provider[0]] = provider[1];
			providersKeys.push(provider[0]);
			providersQuery.push('site:' + provider[0]);
		});

	function clearTitle(title) {
		filters.forEach(function (filter) {
			var regexp = new RegExp(filter, 'gi');

			title = title.replace(regexp, '');
		});

		return title;
	}

	return function (track, callback) {
		if (!track.title || !track.artist) {
			callback(true);
			return;
		}

		var xhr = new XMLHttpRequest(),
			params = {
				hl: 'en',
				q: clearTitle(track.title) + ' ' + track.artist + ' Lyrics AND (' + providersQuery.join(' OR ') + ')'
			};

		xhr.ontimeout = function () {
			callback('timeout');
		};

		xhr.onerror = function (e) {
			callback(e.toString());
		};

		xhr.onload = function () {
			var response = xhr.responseText,
				url,
				host;

			logger('got response from the search');

			try {
				url = response.split(' id="search"')[1].split('<a href="')[1].split('"')[0];
				host = url.match(/^https?:\/\/(?:www\.)?([^\/]+)/i)[1];
			} catch (e) {
				logger('error parsing query results: %s', e.toString());
				callback(e.toString());
				return;
			}

			logger('parsed host: %s', host);

			chrome.runtime.sendMessage({
				remote: {
					url: url,
					timeout: 10
				}
			}, function (data) {
				if (data.error) {
					logger('error fetching lyrics on %s: %s', host, data.error);
					callback(data.error);
					return;
				}

				chrome.runtime.sendMessage({
					sandbox: {
						command: 'run',
						arguments: 'response',
						body: providersHash[host],
						apply: [data.response]
					}
				}, function (data) {
					if (data.error) {
						logger('error parsing lyrics on %s: %s', host, data.error);
						callback(data.error);
						return;
					}

					callback(null, {
						url: url,
						host: host,
						content: data.result
					});
				});
			});
		};

		xhr.timeout = 10000;

		logger('making request %s (timeout %s)', 'https://www.google.com/search?' + queryString(params), xhr.timeout);

		xhr.open('GET', 'https://www.google.com/search?' + queryString(params));
		xhr.send();
	};
});
