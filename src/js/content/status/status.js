export default class Status {
	constructor({ playing, play_enabled, shuffle, repeat, forward_enabled, rewind_enabled }) {
		this._playing = playing;
		this._play_enabled = play_enabled;
		this._shuffle = shuffle;
		this._repeat = repeat;
		this._forward_enabled = forward_enabled;
		this._rewind_enabled = rewind_enabled;
	}

	get playing() {
		return this._playing;
	}

	set playing(value) {
		this._playing = value;
	}

	get play_enabled() {
		return this._play_enabled;
	}

	set play_enabled(value) {
		this._play_enabled = value;
	}

	get shuffle() {
		return this._shuffle;
	}

	set shuffle(value) {
		this._shuffle = value;
	}

	get repeat() {
		return this._repeat;
	}

	set repeat(value) {
		this._repeat = value;
	}

	get forward_enabled() {
		return this._forward_enabled;
	}

	set forward_enabled(value) {
		this._forward_enabled = value;
	}

	get rewind_enabled() {
		return this._rewind_enabled;
	}

	set rewind_enabled(value) {
		this._rewind_enabled = value;
	}
}
