define([], function () {
	document.addEventListener('click', function (e) {
		var target = e.target,
			modal;

		if (target.matches('.close')) {
			modal = closest(target, '.overlay');

			if (modal) {
				modal.classList.add('hidden');
			}
		} else if (target.matches('.open-modal')) {
			modal = document.querySelector('#' + target.dataset.id);

			if (modal) {
				modal.classList.remove('hidden');
			}
		}
	});
});