import Status from 'status/status';

export default class StatusFactory {
	static extract() {
		let player = document.getElementById('player'),
			play = document.querySelector('[data-id=play-pause]'),
			shuffle = player.querySelector('[data-id="shuffle"]'),
			repeat = player.querySelector('[data-id="repeat"]');

		return new Status({
			playing: play.classList.contains('playing'),
			play_enabled: !play.disabled,
			shuffle: shuffle.disabled ? 'DISABLED' : shuffle.value,
			repeat: repeat.value,
			forward_enabled: !player.querySelector('[data-id="forward"]').disabled,
			rewind_enabled: !player.querySelector('[data-id="rewind"]').disabled
		});
	}
}
