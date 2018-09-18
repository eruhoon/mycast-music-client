import { ViewAnimation } from 'framework/BaseView';
import { ParentView } from 'framework/ParentView';
import { Lyrics } from 'models/Lyrics';
import { RepeatMode } from 'models/Player';
import { PlayState } from 'models/PlayState';

import { IPlayerView } from './IPlayerView';
import { LyricsView } from './LyricsView';

export class BasePlayerView extends ParentView implements IPlayerView {

	public static readonly DEFAULT_ARTIST: string = 'Cast Player';
	public static readonly DEFAULT_TITLE: string = '캐스트플레이어';
	public static readonly DEFAULT_ICON: string =
		'http://i.imgur.com/IP1XZKl.jpg';
	public static readonly DEFAULT_VOLUME: number = 100;

	private mIconView: JQuery;
	protected mArtistView: JQuery;
	protected mTitleView: JQuery;
	protected mBitrateView: JQuery;
	private mTimeView: JQuery;
	private mSeekBar: JQuery;
	private mTimeProgressBar: JQuery;
	private mPrevButton: JQuery;
	private mPlayPauseButton: JQuery;
	private mStopButton: JQuery;
	private mNextButton: JQuery;
	private mShuffleButton: JQuery;
	private mRepeatButton: JQuery;
	private mLyricsButton: JQuery;
	private mShareButton: JQuery;
	private mMuteButton: JQuery;
	private mVolumeBar: JQuery;
	private mVolumeProgressBar: JQuery;
	private mInfoView: ParentView;
	private mLyricsView: LyricsView;

	private mFlagLyrics: boolean;

	public constructor() {

		super();
		this.setClass('player-view');

		let iconWrapper = $('<div>').addClass('icon-wrapper');
		this.addJQuery(iconWrapper);

		this.mIconView = $('<img>').addClass('icon');
		this.mIconView.appendTo(iconWrapper);

		let rightView = new ParentView();
		rightView.setClass('right');
		this.addView(rightView);

		this.mInfoView = new ParentView();
		this.mInfoView.setClass('info');
		rightView.addView(this.mInfoView);

		this.mArtistView = $('<div>').addClass('artist');
		this.mArtistView.addClass('brown-text text-lighten-3 truncate');
		this.mInfoView.addJQuery(this.mArtistView);

		this.mTitleView = $('<div>').addClass('title');
		this.mTitleView.addClass('white-text truncate');
		this.mInfoView.addJQuery(this.mTitleView);

		const detailView = $('<div>').addClass('detail');
		this.mInfoView.addJQuery(detailView);

		let typeView = $('<div>').addClass('label').text('MP3');
		typeView.appendTo(detailView);

		this.mBitrateView = $('<div>').addClass('label');
		this.mBitrateView.addClass('brown lighten-2');
		this.mBitrateView.appendTo(detailView);

		this.mTimeView = $('<div>').addClass('label');
		this.mTimeView.addClass('brown-text text-lighten-2');
		this.mTimeView.appendTo(detailView);

		this.mLyricsView = new LyricsView();
		this.mLyricsView.hide();
		rightView.addView(this.mLyricsView);

		const componentView = $('<div>').addClass('component');
		rightView.addJQuery(componentView);

		this.mSeekBar = $('<div>').addClass('seek-bar');
		this.mSeekBar.addClass('progress brown');
		this.mSeekBar.on('click', e => {
			const offset = e.offsetX / this.mSeekBar.width();
			this.onSeekBarClick(offset);
		});
		this.mSeekBar.appendTo(componentView);

		this.mTimeProgressBar = $('<div>');
		this.mTimeProgressBar.addClass('brown lighten-3');
		this.mTimeProgressBar.css({ width: 0 });
		this.mTimeProgressBar.appendTo(this.mSeekBar);

		const buttonView = $('<div>').addClass('button-view');
		buttonView.appendTo(componentView);

		const leftButtonView = $('<div>').addClass('left-buttons');
		leftButtonView.appendTo(buttonView);

		const material = (i: string) => `<i class="material-icons">${i}</i>`;

		this.mPrevButton = $('<button>');
		this.mPrevButton.html(material('skip_previous'));
		this.mPrevButton.on('click', () => this.onPrevButtonClick());
		this.mPrevButton.appendTo(leftButtonView);

		this.mPlayPauseButton = $('<button>');
		this.mPlayPauseButton.html(material('play_arrow'));
		this.mPlayPauseButton.on('click', () => this.onPlayPauseButtonClick());
		this.mPlayPauseButton.appendTo(leftButtonView);

		this.mStopButton = $('<button>');
		this.mStopButton.html(material('stop'));
		this.mStopButton.on('click', () => this.onStopButtonClick());
		this.mStopButton.appendTo(leftButtonView);

		this.mNextButton = $('<button>');
		this.mNextButton.html(material('skip_next'));
		this.mNextButton.on('click', () => this.onNextButtonClick());
		this.mNextButton.appendTo(leftButtonView);

		this.mShuffleButton = $('<button>');
		this.mShuffleButton.html(material('shuffle'));
		this.mShuffleButton.on('click', () => this.onShuffleButtonClick());
		this.mShuffleButton.appendTo(leftButtonView);

		this.mRepeatButton = $('<button>');
		this.mRepeatButton.html(material('repeat'));
		this.mRepeatButton.on('click', () => this.onRepeatButtonClick());
		this.mRepeatButton.appendTo(leftButtonView);

		this.mLyricsButton = $('<button>');
		this.mLyricsButton.html(material('subtitles'));
		this.mLyricsButton.on('click', () => this._onLyricsButtonClick());
		this.mLyricsButton.attr('title', '가사 보기');
		this.mLyricsButton.appendTo(leftButtonView);

		const rightButtonView = $('<div>').addClass('right-buttons');
		rightButtonView.appendTo(buttonView);

		this.mShareButton = $('<button>');
		this.mShareButton.html(material('link'));
		this.mShareButton.on('click', () => this.onShareButtonClick());
		this.mShareButton.appendTo(rightButtonView);

		this.mMuteButton = $('<button>');
		this.mMuteButton.html(material('volume_up'));
		this.mMuteButton.on('click', _ => this.onMuteButtonClick());
		this.mMuteButton.appendTo(rightButtonView);

		this.mVolumeBar = $('<div>').addClass('volume-bar');
		this.mVolumeBar.on('click', e => {
			const offset = e.offsetX / this.mVolumeBar.width();
			this.onVolumeBarClick(offset);
		});
		this.mVolumeBar.appendTo(rightButtonView);

		this.mVolumeProgressBar = $('<div>');
		this.mVolumeProgressBar.appendTo(this.mVolumeBar);

		this.mFlagLyrics = true;
	}

	public setIcon(icon: string): void {
		this.mIconView.attr('src', icon);
	}

	public setArtist(artist: string): void {
		this.mArtistView.text(artist);
	}

	public setTitle(title: string): void {
		this.mTitleView.text(title);
	}

	public setTime(current: number, duration: number) {
		let currentFormat = this.getTimeFormat(current);
		let durationFormat = this.getTimeFormat(duration);
		this.mTimeView.text(`${currentFormat}/${durationFormat}`);

		let percent = current / duration * 100;
		this.mTimeProgressBar.css('width', `${percent}%`);
	}

	public setPlayState(state: PlayState) {
		let iconView = this.mPlayPauseButton.children('i');
		switch (state) {
			case PlayState.PLAY:
				iconView.text('pause');
				break;
			case PlayState.PAUSE:
				iconView.text('play_arrow');
				break;
			case PlayState.INIT:
				iconView.text('play_arrow');
				break;
		}
	}

	public setShuffleMode(shuffleMode: boolean) {
		if (shuffleMode) {
			this.mShuffleButton.removeClass('active');
		} else {
			this.mShuffleButton.addClass('active');
		}
	}

	public setRepeatMode(repeatMode: RepeatMode) {
		let iconView = this.mRepeatButton.children('i');
		switch (repeatMode) {
			case RepeatMode.ONE:
				this.mRepeatButton.addClass('active');
				iconView.text('repeat_one');
				break;

			case RepeatMode.ALL:
				this.mRepeatButton.addClass('active');
				iconView.text('repeat');
				break;

			case RepeatMode.NONE:
			default:
				this.mRepeatButton.removeClass('active');
				iconView.text('repeat');
		}
	}

	public setMute(mute: boolean): void {
		let iconView = this.mMuteButton.children('i');
		if (mute) {
			iconView.text('volume_off');
		} else {
			iconView.text('volume_up');
		}
	}

	public setVolume(volume: number): void {
		this.mVolumeProgressBar.width(`${volume}%`);
	}

	public setLyrics(lyrics: Lyrics) {
		this.mLyricsView.setLyrics(lyrics);
	}

	public setCurrentTime(current: number) {
		this.mLyricsView.setCurrentTime(current);
	}

	public onSeekBarClick(offset: number): void { }

	public onPrevButtonClick(): void { }

	public onNextButtonClick(): void { }

	public onPlayPauseButtonClick(): void { }

	public onStopButtonClick(): void { }

	public onShuffleButtonClick(): void { }

	public onRepeatButtonClick(): void { }

	public onShareButtonClick(): void { }

	public onMuteButtonClick(): void { }

	private _onLyricsButtonClick(): void {
		if (this.mFlagLyrics) {
			this.mFlagLyrics = false;
			this.mInfoView.show(ViewAnimation.FADE_IN);
			this.mLyricsView.hide(ViewAnimation.FADE_OUT);
		} else {
			this.mFlagLyrics = true;
			this.mInfoView.hide(ViewAnimation.FADE_OUT);
			this.mLyricsView.show(ViewAnimation.FADE_IN);
		}
		this.onLyricsButtonClick();
	}

	public onLyricsButtonClick(): void { }

	public onVolumeBarClick(offset: number): void { }

	private getTimeFormat(value: number): string {
		const current = Math.floor(value);
		const minute = Math.floor(current / 60);
		const second = Math.floor(current % 60);

		return `${minute}:${second < 10 ? '0' : ''}${second}`;
	}

}