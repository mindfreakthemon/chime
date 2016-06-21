export default class Track {

	protected _title: string;
	protected _artist: string;
	protected _album: string;
	protected _cover: string;
	protected _duration: number;
	protected _position: number;

	constructor({ title, artist, album, cover, duration, position }) {
		this.title = title;
		this.artist = artist;
		this.album = album;
		this.cover = cover;
		this.duration = duration;
		this.position = position;
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
