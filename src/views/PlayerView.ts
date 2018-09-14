import { MainController } from 'controllers/MainController';
import { Music } from 'models/Music';
import { RepeatMode } from 'models/Player';
import { PlayState } from 'models/PlayState';

import { BasePlayerView } from './BasePlayerView';
import { LyricsView } from './LyricsView';

export class PlayerView extends BasePlayerView {

	private mController: MainController;
	private mCurrentTime: number;
	private mDuration: number;

	public constructor(controller: MainController) {

		super();

		this.mController = controller;

		this.mCurrentTime = 0;
		this.mDuration = 0;

		$('#btnNext').on('click', e => { this.nextPlay(); });
		$('#btnPrev').on('click', e => { this.prevPlay(); });

		this.init();
	}

	public init(): void {
		this.setIcon(BasePlayerView.DEFAULT_ICON);
		this.setArtist(BasePlayerView.DEFAULT_ARTIST);
		this.setTitle(BasePlayerView.DEFAULT_TITLE);
		this.setCurrentTime(0);
		this.setDuration(0);
		this.setPlayState(PlayState.INIT);
		this.setVolume(BasePlayerView.DEFAULT_VOLUME);
		this.mBitrateView.text('-k');
	}

	public onSeekBarClick(offset: number) {
		this.mController.seek(offset);
	}

	public onPrevButtonClick(): void {
		this.mController.playPrev();
	}

	public onPlayPauseButtonClick(): void {
		this.mController.pause();
	}

	public onStopButtonClick(): void {
		this.mController.stopMusic();
	}

	public onShuffleButtonClick(): void {
		if (this.mController.isShuffleMode()) {
			this.mController.setShuffleMode(false);
		} else {
			this.mController.setShuffleMode(true);
		}
	}

	public onRepeatButtonClick(): void {
		let repeatMode = this.mController.getRepeatMode();
		let nextMode;
		switch (repeatMode) {
			case RepeatMode.NONE: nextMode = RepeatMode.ONE; break;
			case RepeatMode.ONE: nextMode = RepeatMode.ALL; break;
			case RepeatMode.ALL: nextMode = RepeatMode.NONE; break;
			default: nextMode = RepeatMode.NONE;
		}
		this.mController.setRepeatMode(nextMode);
	}

	public onShareButtonClick(): void {
		this.mController.shareNowPlaying();
	}

	public onMuteButtonClick(): void {
		super.onMuteButtonClick();

		if (this.mController.isMute()) {
			this.mController.setMute(false);
		} else {
			this.mController.setMute(true);
		}
	}

	public onVolumeBarClick(offset: number) {
		super.onVolumeBarClick(offset);

		this.mController.setVolume(offset * 100);
	}

	private prevPlay() {
		var nextDom;
		if (nowPlay.dom.prev().length === 0) {
			var l = nowPlay.dom.parent().children().length;
			nextDom = $(nowPlay.dom.parent().children()[l - 1]);
		}
		else if (FLAG_SHUFFLE_MODE === true) {
			var l = nowPlay.dom.parent().children().length;
			var r = Math.floor(Math.random() * l);
			nextDom = $(nowPlay.dom.parent().children()[r]);
		}
		else {
			nextDom = nowPlay.dom.prev();
		}
		__self.play(nextDom.data('instance'));
	}

	private nextPlay() {
		var nextDom;
		if (nowPlay.dom.next().length === 0) {
			nextDom = $(nowPlay.dom.parent().children()[0]);
		}
		else if (FLAG_SHUFFLE_MODE === true) {
			var l = nowPlay.dom.parent().children().length;
			var r = Math.floor(Math.random() * l);
			nextDom = $(nowPlay.dom.parent().children()[r]);
		}
		else {
			nextDom = nowPlay.dom.next();
		}
		__self.play(nextDom.data('instance'));
	}

	public setMusicInfo(music: Music) {
		this.mArtistView.text(music.getArtist());
		this.mTitleView.text(music.getTitle());
		this.setIcon(music.getIcon());
		const bitrate = Math.round(music.getBitrate() / 1000);
		this.mBitrateView.text(`${bitrate}k`);
	}

	private onEnded() {
		$('#btnPlay>i').attr('class', 'mdi-av-play-arrow');
		$('#btnPlay').off().on('click', function () {
			dom.play();
		})
		$('.music-seek-bar>.determinate').css('width', 0);

		// LYRICS MODULE HERE
		switch (FLAG_REPEAT_MODE) {
			case 'ALL':
				nextPlay();
				break;
			default:
				break;
		}
	}

	public setCurrentTime(current: number) {
		super.setCurrentTime(current);

		this.mCurrentTime = current;
		this.updateTimeView();
	}

	public setDuration(duration: number) {
		if (isNaN(duration)) {
			return;
		}
		this.mDuration = duration;
		this.updateTimeView();
	}

	private updateTimeView() {
		this.setTime(this.mCurrentTime, this.mDuration);
	}

}
