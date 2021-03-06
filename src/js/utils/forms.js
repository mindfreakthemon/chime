/**
 * https://code.google.com/p/form-serialize/
 * @param form
 * @returns {object}
 */
export function objectify(form) {
	if (!form || form.nodeName !== 'FORM') {
		return {};
	}

	var i, j, o = {};

	for (i = form.elements.length - 1; i >= 0; i--) {
		var type = form.elements[i].type,
			name = form.elements[i].name,
			value;

		if (!name) {
			continue;
		}

		switch (form.elements[i].nodeName) {
			case 'INPUT':
				switch (type) {
					case 'text':
					case 'number':
					case 'hidden':
					case 'password':
					case 'button':
					case 'reset':
					case 'submit':
						o[name] = form.elements[i].value;
						break;
					case 'checkbox':
						if (form.elements[i].checked) {
							value = form.elements[i].getAttribute('value') || true;
							if (o[name]) {
								o[name] = [o[name]];
								o[name].push(value);
								break;
							}

							o[name] = value;
						} else {
							if (!o[name]) {
								o[name] = false;
							}
						}
						break;
					case 'radio':
						if (form.elements[i].checked) {
							o[name] = form.elements[i].getAttribute('value') || true;
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

/**
 *
 * @param form
 * @param data
 */
export function deobjectify(form, data) {
	if (!form || form.nodeName !== 'FORM') {
		return;
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
					case 'number':
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
