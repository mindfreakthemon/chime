import { onLoad } from 'content/loader';
import 'styles/theme.css!';

let doc = document.getElementById('doc');

onLoad(() => {
	if (doc) {
		doc.style.height = '';
	}
});
