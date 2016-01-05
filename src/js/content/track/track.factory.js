import Track from 'track/track.js';

export default class TrackFactory {
	static extract() {
		let player = document.getElementById('player'),
			artist = player.querySelector('#player-artist'),
			album = player.querySelector('.player-album'),
			cover = player.querySelector('#playerBarArt'),
			title = player.querySelector('#currently-playing-title'),
			slider = document.getElementById('material-player-progress');

		return new Track({
			title: title ? title.innerText : null,
			artist: artist ? artist.innerText : null,
			album: album ? album.innerText : null,
			cover: cover ? cover.src : cover,
			duration: +slider.getAttribute('aria-valuemax'),
			position: +slider.getAttribute('aria-valuenow'),
			id: document.querySelector('.song-row.currently-playing').dataset.id
		});
	}
}
