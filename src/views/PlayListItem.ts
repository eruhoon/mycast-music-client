import { Music } from 'models/Music';

import { ListItem } from './ListItem';
import { ViewAnimation } from 'framework/BaseView';

export class PlayListItem extends ListItem {

	private static DEFAULT_IMAGE: string = '/home/resource/img/music/music.png';

	private mIconView: JQuery;
	private mArtistView: JQuery;
	private mTitleView: JQuery;
	private mRemoveButton: JQuery;

	private mOnRemoveButtonClickCallback: Callback;

	public constructor() {
		super();
		this.setClass('play-list-item');

		const iconSection = $('<div>').addClass('icon-section');
		this.addJQuery(iconSection);

		this.mIconView = $('<img>');
		this.mIconView.attr('src', PlayListItem.DEFAULT_IMAGE);
		this.mIconView.appendTo(iconSection);

		const infoSection = $('<div>').addClass('info-section');
		this.addJQuery(infoSection);

		const infoView = $('<div>').addClass('info');
		infoView.appendTo(infoSection);

		this.mArtistView = $('<div>').addClass('artist');
		this.mArtistView.appendTo(infoView);

		this.mTitleView = $('<div>').addClass('title');
		this.mTitleView.appendTo(infoView);

		const menuSection = $('<div>').addClass('menu-section');
		this.addJQuery(menuSection);

		this.mRemoveButton = $('<button>');
		this.mRemoveButton.html('<i class=material-icons>remove</i>')
		this.mRemoveButton.on('click', () => {
			this.mOnRemoveButtonClickCallback();
			return false;
		})
		this.mRemoveButton.appendTo(menuSection);

		this.mOnRemoveButtonClickCallback = () => { };
	}

	public bind(music: Music) {
		this.mIconView.attr('src', music.getIcon());
		this.mArtistView.text(music.getArtist());
		this.mTitleView.text(music.getTitle());
	}

	public remove() {
		this.mRemoveButton.off();
		super.remove(ViewAnimation.FADE_OUT);
	}

	public setOnRemoveButtonClickCallback(callback: Callback) {
		this.mOnRemoveButtonClickCallback = callback;
	}

	protected onContextMenu(e: JQuery.Event): boolean { return false; }

}