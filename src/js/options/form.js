import settings from 'settings';
import 'body';


var form = document.getElementById('form');

form.addEventListener('change', function (e) {
	var data = objectify(form);

	chrome.storage.sync.set(data, function () {
		//notify('Chime Settings', 'All Settings were saved!', 1000);
	});
});

document.getElementById('debug-reset')
	.addEventListener('click', function () {
		chrome.storage.sync.clear();

		location.reload();
	});

// set inputs according to current Settings
deobjectify(form, settings.getAll());
