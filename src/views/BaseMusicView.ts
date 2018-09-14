import { ViewEvent } from 'framework/BaseView';
import { Music } from 'models/Music';

import { ListItem } from './ListItem';

enum MusicViewMode {
	INFO = 'INFO',
	TAG = 'TAG'
}

export class BaseMusicView extends ListItem {

	private static readonly ICON_ERROR_URL: string
		= '/home/resource/img/music.png';

	private mIconView: JQuery;
	private mEntryView: JQuery;
	private mTitleView: JQuery;
	private mArtistView: JQuery;
	private mBitrateView: JQuery;
	private mTimeView: JQuery;
	private mMenuView: JQuery;
	private mTagView: JQuery;
	private mTagEditorView: JQuery;
	private mTagListView: JQuery;

	private mMode: MusicViewMode;

	public constructor() {

		super();
		this.setClass('music-view');

		const leftSection = $('<div>').addClass('left-section');
		this.addJQuery(leftSection);

		this.mIconView = $('<img>').addClass('responsive-img')
		this.mIconView.appendTo(leftSection);

		const rightSection = $('<div>').addClass('right-section');
		this.addJQuery(rightSection);

		this.mEntryView = $('<div>').addClass('entry');
		this.mEntryView.appendTo(rightSection);

		this.mTitleView = $('<div>').addClass('title truncate');
		this.mTitleView.appendTo(this.mEntryView);

		this.mArtistView = $('<div>').addClass('artist truncate');
		this.mArtistView.appendTo(this.mEntryView);

		let infoView = $('<div>').addClass('info')
		infoView.appendTo(this.mEntryView);

		this.mBitrateView = $('<div>').addClass('bitrate');
		this.mBitrateView.appendTo(infoView);

		this.mTimeView = $('<div>').addClass('playtime');
		this.mTimeView.appendTo(infoView);

		const buttonStyle = 'button';

		this.mMenuView = $('<div>').addClass('menu');
		this.mMenuView.appendTo(rightSection);

		let material = (i: string) => `<i class="material-icons">${i}</i>`;

		const playButton = $('<button>').addClass('button')
		playButton.html(material('play_arrow'))
		playButton.on('click', () => {
			this.onPlayButtonClick();
			return false;
		});
		playButton.appendTo(this.mMenuView);

		const addPlayListButton = $('<button>').addClass(buttonStyle)
		addPlayListButton.html(material('playlist_add'))
		addPlayListButton.on('click', () => {
			this.onAddFavoriteButtonClick();
			return false;
		});
		addPlayListButton.appendTo(this.mMenuView);

		const downloadButton = $('<button>').addClass(buttonStyle)
		downloadButton.html(material('file_download'));
		downloadButton.on('click', () => {
			this.onDownloadButtonClick();
			return false;
		});
		downloadButton.appendTo(this.mMenuView);

		const shareButton = $('<button>').addClass(buttonStyle)
		shareButton.html(material('link'));
		shareButton.on('click', () => {
			this.onShareButtonClick();
			return false;
		});
		shareButton.appendTo(this.mMenuView);

		const deleteButton = $('<button>').addClass(buttonStyle)
		deleteButton.html(material('delete'));
		deleteButton.on('click', () => {
			this.onDeleteButtonClick();
			return false;
		});
		// deleteButton.hide();
		deleteButton.appendTo(this.mMenuView);

		this.mTagView = $('<div>').addClass('tag-view')
		this.mTagView.on('click', e => {
			let tagsView = this.mTagListView.children();
			let text = tagsView.toArray().map(e => $(e).text()).join(', ');
			this.mTagEditorView.val(text);
			this.mTagEditorView.show();
			this.mTagEditorView.focus();
			this.mTagListView.hide();
			return false;
		});
		this.mTagView.appendTo(rightSection);

		this.mTagEditorView = $('<textarea>');
		this.mTagEditorView.appendTo(this.mTagView);
		this.mTagEditorView.on('keydown', e => {
			let query: string = this.mTagEditorView.val().toString();
			switch (e.which) {
				case 13:
					this.mTagEditorView.hide();
					this.mTagListView.show();
					this.onTagEditorSubmit(query);
					return false;
				case 27:
					this.mTagEditorView.hide();
					this.mTagListView.show();
					break;
			}
		});

		this.mTagListView = $('<div>').addClass('tag-list-view');
		this.mTagListView.appendTo(this.mTagView);

		this.mMode = MusicViewMode.INFO;
	}

	public bind(music: Music) {

		this.mIconView.one('error', _ => {
			this.mIconView.one('error', _ => {
				this.mIconView.attr('src', BaseMusicView.ICON_ERROR_URL);
			});
			this.onIconError();
		});
		this.mIconView.attr('src', `/fs/music/thumb/${music.getIndex()}.png`);
		this.mArtistView.text(music.getArtist());
		this.mTitleView.text(music.getTitle());
		let bitrate = Math.round(music.getBitrate() / 1000);
		this.mBitrateView.text(`${bitrate}k`);
		this.mTimeView.text(music.getPlayTime());
		this.mTagEditorView.val(music.getTag().join(', '));
		this.setTags(music.getTag());
	}

	public setIcon(icon: string) {
		this.mIconView.attr('src', icon);
	}

	public setTags(tags: string[]) {
		this.mTagListView.empty();
		this.mTagListView.append(tags.map(tag => {
			let tagView = $('<div>').addClass('tag-item');
			tagView.text(tag);
			return tagView;
		}));
	}

	public changeMode(mode: MusicViewMode) {
		this.mMode = mode;

		switch (mode) {
			case MusicViewMode.TAG:
				this.mEntryView.fadeOut(200);
				this.mMenuView.hide();
				this.mTagView.fadeIn(200);
				break;
			case MusicViewMode.INFO:
				this.mEntryView.fadeIn(200);
				this.mMenuView.show();
				this.mTagView.fadeOut(200);
				break;
		}
	}

	protected onIconError() { }

	protected onPlayButtonClick() { }

	protected onAddFavoriteButtonClick() { }

	protected onDownloadButtonClick() { }

	protected onShareButtonClick() { }

	protected onDeleteButtonClick() { }

	protected onTagEditorSubmit(_query: string) { }

	protected onContextMenu(_e: JQuery.Event): boolean {
		if (this.mMode === MusicViewMode.TAG) {
			this.changeMode(MusicViewMode.INFO);
		} else {
			this.changeMode(MusicViewMode.TAG);
		}
		return false;
	}
}
