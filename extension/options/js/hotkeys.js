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
