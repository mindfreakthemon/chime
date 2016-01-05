export default class Track {
	constructor({ id, title, artist, album, cover, duration, position }) {
		this.id = id;
		this.title = title;
		this.artist = artist;
		this.album = album;
		this.cover = cover;
		this.duration = duration;
		this.position = position;
	}

	get id() {
		return this._id;
	}

	set id(value) {
		this._id = value;
	}

	get title() {
		return this._title;
	}

	set title(value) {
		this._title = value;
	}

	get artist() {
		return this._artist;
	}

	set artist(value) {
		this._artist = value;
	}

	get album() {
		return this._album;
	}

	set album(value) {
		this._album = value;
	}

	get cover() {
		return this._cover;
	}

	set cover(value) {
		this._cover = value;
	}

	get duration() {
		return this._duration;
	}

	set duration(value) {
		this._duration = value;
	}

	get position() {
		return this._position;
	}

	set position(value) {
		this._position = value;
	}

	get sign() {
		return this.title + this.artist + this.album + this.cover + this.duration;
	}

	get progress() {
		return Math.round(100 * this.position / this.duration);
	}

	/**
	 * @param {Track} track
	 * @return boolean
	 */
	equals(track) {
		return track ? this.sign === track.sign : false;
	}
}
