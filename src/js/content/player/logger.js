import * as observer from 'player/observer.js';
import * as player from 'player/player.js';
import * as clock from 'player/clock.js';

let logger = getLogger('player/logger');

observer.onSeeking.addListener(() => logger('observer.onSeeking'));
observer.onPlaying.addListener(() => logger('observer.onPlaying'));
observer.onPausing.addListener(() => logger('observer.onPausing'));

player.onPlaying.addListener(() => logger('player.onPlaying: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
player.onResumed.addListener(() => logger('player.onResumed: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
player.onStopped.addListener(() => logger('player.onStopped: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
player.onPaused.addListener(() => logger('player.onPaused: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
player.onFinished.addListener(() => logger('player.onFinished: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
player.onSeeking.addListener(() => logger('player.onSeeking: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
