import Track from 'content/track/track';

export default class TrackFactory {
	static extract() {
		let player = document.getElementById('player');
		let artist = player.querySelector('#player-artist');
		let album = player.querySelector('.player-album');
		let cover = <HTMLImageElement> player.querySelector('#playerBarArt');
		let title = player.querySelector('#currently-playing-title');
		let slider = document.getElementById('material-player-progress');

		return new Track({
			title: title ? title.textContent : null,
			artist: artist ? artist.textContent : null,
			album: album ? album.textContent : null,
			cover: cover ? cover.src : cover,
			duration: +slider.getAttribute('aria-valuemax'),
			position: +slider.getAttribute('aria-valuenow')
		});
	}
}
