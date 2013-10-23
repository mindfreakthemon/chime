// options.html

var form = document.querySelector('#form');

document.addEventListener('DOMContentLoaded', function () {
	deobjectify(form, settings);
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