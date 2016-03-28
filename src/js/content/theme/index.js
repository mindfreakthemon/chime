import { onLoad } from 'content/loader.js';
import 'styles/theme.css!';

var doc = document.getElementById('doc');

onLoad(() => {
	if (doc) {
		doc.style.height = '';
	}
});
