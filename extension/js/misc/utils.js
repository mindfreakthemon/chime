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
			name = form.elements[i].name,
			value;

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
function deobjectify(form, data) {
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

/**
 *
 * @param str
 * @param len
 * @param ph
 * @returns {string}
 */
function strpad(str, len, ph) {
	str = str.toString();

	if (str.length < len) {
		len -= str.length;
		while (len--) {
			str = (ph || ' ') + str;
		}
	}

	return str;
}

/**
 *
 * @param params
 * @returns {string}
 */
function queryString(params) {
	var x,
		parts = [];

	for (x in params) {
		parts.push(x + '=' + encodeURIComponent(params[x]));
	}

	return parts.join('&');
}


/**
 *
 * @param label
 * @returns {*}
 */
function getLogger(label) {
	function converter(val) {
		if (typeof val === 'string') {
			return val;
		}

		return val.toString();
	}

	return function () {
		var argv = Array.prototype.slice.call(arguments),
			arg0 = argv.shift() || '',
			args = [label + ':' + (arg0 ? ' ' + arg0 : '')].concat(argv);

		return console.log.apply(console, args.map(converter));
	};
}
