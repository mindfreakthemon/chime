define(['settings'], function (settings) {
	var checkbox = document.querySelector('input[name=notify_enabled]');

	if (!checkbox) {
		return;
	}

	checkbox.parentNode.addEventListener('click', function (e) {
		var enabled = checkbox.checked;

		chrome.permissions[enabled ? 'request' : 'remove']({
			origins: settings.get('notify_origins')
		}, function (granted) {
			checkbox.checked = enabled && granted;
		});
	});
});
