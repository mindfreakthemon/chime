import Status from 'content/status/status';

export default class StatusFactory {
	static extract() {
		let player = document.getElementById('player');
		let play = <HTMLButtonElement> document.querySelector('[data-id=play-pause]');
		let shuffle = <HTMLButtonElement> player.querySelector('[data-id="shuffle"]');
		let repeat = <HTMLButtonElement> player.querySelector('[data-id="repeat"]');
		let forward = <HTMLButtonElement> player.querySelector('[data-id="forward"]');
		let rewind = <HTMLButtonElement> player.querySelector('[data-id="rewind"]');

		return new Status({
			playing: play.classList.contains('playing'),
			play_enabled: !play.disabled,
			shuffle: shuffle.disabled ? 'DISABLED' : shuffle.value,
			repeat: repeat.value,
			forward_enabled: !forward.disabled,
			rewind_enabled: !rewind.disabled
		});
	}
}
