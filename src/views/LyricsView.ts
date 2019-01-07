import { BaseView } from 'framework/BaseView';
import { Lyrics } from 'models/Lyrics';

export class LyricsView extends BaseView {

	private mPrevView: JQuery;
	private mNowView: JQuery;
	private mNextView: JQuery;

	private mLyrics: Lyrics | null;
	private mCurrentTime: number;

	public constructor() {
		super('<div>');
		this.setClass('lyrics-view');

		let contentView = $('<div>').addClass('content');
		this.addJQuery(contentView);

		this.mPrevView = $('<div>').addClass('prev');
		contentView.append(this.mPrevView);

		this.mNowView = $('<div>').addClass('now');
		this.mNowView.addClass('brown-text text-lighten-4');
		this.mNowView.css('font-weight', 'bold');
		this.mNowView.text('Cast Player Lyrics');
		contentView.append(this.mNowView);

		this.mNextView = $('<div>').addClass('next');
		contentView.append(this.mNextView);

		this.mLyrics = null;
		this.mCurrentTime = 0;
	}

	public setLyrics(lyrics: Lyrics) {
		this.mLyrics = lyrics;
		this.mCurrentTime = 0;

		this.update();
	}

	public setCurrentTime(current: number) {
		this.mCurrentTime = current;

		this.update();
	}

	private update() {
		if (this.mLyrics === null) { return; }

		let idx;
		for (idx = 0; idx < this.mLyrics.length - 1; idx++) {
			let timestamp = this.mLyrics[idx].timestamp;
			if (this.mCurrentTime + 0.1 < timestamp) break;
		}

		this.mPrevView.text(idx >= 2 ? this.mLyrics[idx - 2].lyrics : '');
		this.mNowView.text(idx >= 1 ? this.mLyrics[idx - 1].lyrics : '');
		this.mNextView.text(idx >= 0 ? this.mLyrics[idx].lyrics : '');
	}

}