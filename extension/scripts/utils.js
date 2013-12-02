/**
 * Display webkit notification
 * @param title
 * @param body
 * @param img
 * @param timeout
 */
function notify(title, body, img, timeout) {
	if (arguments.length === 3) {
		if (typeof img === 'number') {
			timeout = img;
			img = null;
		}
	}

	if (typeof timeout === 'undefined') {
		timeout = 3000;
	}

	var notification = webkitNotifications.createNotification(
		img || 'images/icon.png',
		title || 'Chime',
		body
	);

	notification.show();

	if (timeout > 0) {
		notification.onshow = function () {
			setTimeout(function () {
				notification.close();
			}, timeout || 3000);
		};
	}
}

/**
 * Returns closest element (including self) that matches selector
 * @param elem
 * @param selector
 * @returns {*}
 */
function closest(elem, selector) {
	var matchesSelector = elem.matches || elem.webkitMatchesSelector;

	while (elem) {
		try {
			if (matchesSelector.call(elem, selector)) {
				return elem;
			} else {
				elem = elem.parentNode;
			}
		} catch (e) {
			return null;
		}
	}

	return null;
}

/**
 *
 * @param target
 * @returns {*}
 */
function extend(target) {
	Array.prototype.splice.call(arguments, 1)
		.forEach(function (object) {
			if (!object) {
				return;
			}

			for (var i = 0, k = Object.keys(object), l = k.length; i < l; ++i) {
				target[k[i]] = object[k[i]];
			}
		});

	return target;
}

/**
 * https://code.google.com/p/form-serialize/
 * @param form
 * @returns {object}
 */
function objectify(form) {
	if (!form || form.nodeName !== 'FORM') {
		return {};
	}

	var i, j, o = {};

	for (i = form.elements.length - 1; i >= 0; i--) {
		var type = form.elements[i].type,
			name = form.elements[i].name;

		if (!name) {
			continue;
		}

		switch (form.elements[i].nodeName) {
			case 'INPUT':
				switch (type) {
					case 'text':
					case 'hidden':
					case 'password':
					case 'button':
					case 'reset':
					case 'submit':
						o[name] = form.elements[i].value;
						break;
					case 'checkbox':
						if (form.elements[i].checked) {
							if (o[name]) {
								o[name] = [o[name]];
								o[name].push(form.elements[i].value);
								break;
							}

							o[name] = form.elements[i].value;
						}
						break;
					case 'radio':
						if (form.elements[i].checked) {
							o[name] = form.elements[i].value;
						} else if (!(name in o)) {
							o[name] = null;
						}
						break;
					case 'file':
						break;
				}
				break;
			case 'TEXTAREA':
				o[name] = form.elements[i].value;
				break;
			case 'SELECT':
				switch (type) {
					case 'select-one':
						o[name] = form.elements[i].value;
						break;
					case 'select-multiple':
						for (j = form.elements[i].options.length - 1; j >= 0; j--) {
							o[name] = [];

							if (form.elements[i].options[j].selected) {
								o[name].push(form.elements[i].options[j].value);
							}
						}
						break;
				}
				break;
			case 'BUTTON':
				switch (type) {
					case 'reset':
					case 'submit':
					case 'button':
						o[name] = form.elements[i].value;
						break;
				}
				break;
		}
	}

	return o;
}

function deobjectify(form, data) {
	if (!form || form.nodeName !== 'FORM') {
		return {};
	}

	var i, j;

	for (i = form.elements.length - 1; i >= 0; i--) {
		var type = form.elements[i].type,
			name = form.elements[i].name;

		if (!name || !(name in data)) {
			continue;
		}

		switch (form.elements[i].nodeName) {
			case 'INPUT':
				switch (type) {
					case 'text':
					case 'hidden':
					case 'password':
					case 'button':
					case 'reset':
					case 'submit':
						form.elements[i].value = data[name];
						break;
					case 'checkbox':
						var is_array = Array.isArray(data[name]);

						if (!is_array && data[name] || is_array && data[name].indexOf(form.elements[i].value) !== -1) {
							form.elements[i].checked = true;
						}
						break;
					case 'radio':
						if (data[name]) {
							form.elements[i].checked = true;
						}
						break;
					case 'file':
						break;
				}
				break;
			case 'TEXTAREA':
				form.elements[i].value = data[name];
				break;
			case 'SELECT':
				switch (type) {
					case 'select-one':
						form.elements[i].value = data[name];
						break;
					case 'select-multiple':
						for (j = form.elements[i].options.length - 1; j >= 0; j--) {
							if (form.elements[i].options[j].value === data[name]) {
								form.elements[i].options[j].selected = true;
							}
						}
						break;
				}
				break;
			case 'BUTTON':
				switch (type) {
					case 'reset':
					case 'submit':
					case 'button':
						form.elements[i].value = data[name];
						break;
				}
				break;
		}
	}
}
