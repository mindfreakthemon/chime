window.addEventListener('message', function (e) {
	var command = e.data.command,
		result, func, error = null;

	switch (command) {
		case 'run':
			/* jshint evil:true */
			func = new Function(e.data.arguments, e.data.body);

			try {
				result = func.apply(null, e.data.apply);
			} catch (exc) {
				error = exc.toString();
			}

			e.source.postMessage({
				id: e.data.id,
				result: result,
				error: error
			}, e.origin);

			break;
	}
});
