import * as observer from 'content/player/observer.js';
import * as player from 'content/player/player.js';
import * as clock from 'content/player/clock.js';
import * as logger from 'utils/logger.js';

observer.onSeeking.addListener(() => logger.info('observer.onSeeking'));
observer.onPlaying.addListener(() => logger.info('observer.onPlaying'));
observer.onPausing.addListener(() => logger.info('observer.onPausing'));

player.onPlaying.addListener(() => logger.info('player.onPlaying: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
player.onResumed.addListener(() => logger.info('player.onResumed: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
player.onStopped.addListener(() => logger.info('player.onStopped: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
player.onPaused.addListener(() => logger.info('player.onPaused: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
player.onFinished.addListener(() => logger.info('player.onFinished: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
player.onSeeking.addListener(() => logger.info('player.onSeeking: %s, %s', clock.getPlayedTime(), clock.getStartTimestamp()));
