import storage from 'utils/storage';
import * as forms from 'utils/forms';

let form = document.getElementById('form');

form.addEventListener('change', (e) => {
	let data = forms.objectify(form);

	chrome.storage.sync.set(data, () => {
		// notify('Chime Settings', 'All Settings were saved!', 1000);
	});
});

document.getElementById('debug-reset')
	.addEventListener('click', () => {
		chrome.storage.sync.clear();

		location.reload();
	});

// set inputs according to current Settings
forms.deobjectify(form, storage.getAll());
