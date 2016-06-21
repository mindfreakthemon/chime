import * as logger from 'utils/logger';

export default function (data) {
	logger.info('making GET request to %s (timeout on %s)', data.url, data.timeout);

	return fetch(data.url)
		.then((response) => response.text());
}
