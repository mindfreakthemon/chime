import storage from 'utils/storage';
import * as querystring from 'utils/querystring';
import * as logger from 'utils/logger';

let filters = storage.get('lyrics_filters'),
	providers = storage.get('lyrics_providers'),
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
		let regexp = new RegExp(filter, 'gi');

		title = title.replace(regexp, '');
	});

	return title;
}

export default function (track) {
	return new Promise((resolve, reject) => {
		if (!track.title || !track.artist) {
			reject(true);
			return;
		}

		let params = {
			hl: 'en',
			q: clearTitle(track.title) + ' ' + track.artist + ' Lyrics AND (' + providersQuery.join(' OR ') + ')'
		};

		logger.info('making request %s (timeout %s)', 'https://www.google.com/search?' + querystring.stringify(params));

		return fetch('https://www.google.com/search?' + querystring.stringify(params))
			.then((response) => response.text())
			.then((text) => {
				let url, host;

				logger.info('got response from the search');

				try {
					url = text.split(' id="search"')[1].split('<a href="')[1].split('"')[0];
					host = url.match(/^https?:\/\/(?:www\.)?([^\/]+)/i)[1];
				} catch (e) {
					logger.info('error parsing query results: %s', e.toString());

					reject(e.toString());
					return;
				}

				logger.info('parsed host: %s', host);

				chrome.runtime.sendMessage({
					remote: {
						url: url,
						timeout: 10
					}
				}, function (data) {
					if (data.error) {
						logger.info('error fetching lyrics on %s: %s', host, data.error);

						reject(data.error);
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
							logger.info('error parsing lyrics on %s: %s', host, data.error);

							reject(data.error);
							return;
						}

						resolve({
							url: url,
							host: host,
							content: data.result
						});
					});
				});
			});
	});

}
