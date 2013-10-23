window.addEventListener('storage', function (e) {
	if (e.key !== 'options') {
		return;
	}

	updateSettings(JSON.parse(e.newValue));
	applySettings();
});

updateTabs();
applySettings();
commandsConnect();
runtimeMessagesConnect();