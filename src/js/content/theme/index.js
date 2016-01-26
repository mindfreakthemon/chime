import { onLoad } from 'content/loader.js';
import 'styles/theme.css!';

var doc = document.getElementById('doc');

onLoad(() => {
	doc.style.height = '';
});
