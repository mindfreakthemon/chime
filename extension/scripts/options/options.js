// options.html

var form = document.querySelector('#form');

document.addEventListener('DOMContentLoaded', function () {
	// set inputs according to current settings
	deobjectify(form, settings);

	// insert custom browser hotkeys
	chrome.commands.getAll(function (hotkeys) {
		hotkeys.forEach(function (hotkey) {
			var dl = document.querySelector('#command-' + hotkey.name);

			if (dl) {
				var dt = document.createElement('dt');
				dt.innerText = hotkey.shortcut;

				dl.insertBefore(dt, dl.firstChild);
			}
		});
	});
});

form.addEventListener('change', function (e) {
	var data = objectify(form);

	// convert
	data.open_new = !!data.open_new;
	data.open_active = !!data.open_active;
	data.open_pinned = !!data.open_pinned;
	data.native_hot_keys = !!data.native_hot_keys;

	localStorage.options = JSON.stringify(data);

	notify('Chime settings', 'All settings were saved!', 1000);
});
