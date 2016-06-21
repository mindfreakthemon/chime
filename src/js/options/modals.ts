document.addEventListener('click', e => {
	let target = <HTMLElement> e.target;

	if (target.matches('.close')) {
		let modal = target.closest('.overlay');

		if (modal) {
			modal.classList.add('hidden');
		}
	} else if (target.matches('.open-modal')) {
		let modal = document.querySelector('#' + target.dataset['id']);

		if (modal) {
			modal.classList.remove('hidden');
		}
	}
});

export {};
