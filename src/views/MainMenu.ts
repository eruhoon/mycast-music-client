import { ParentView } from "framework/ParentView";

export const enum MainMenuItem {
	HOME = 'HOME',
	PLAYLIST = 'PLAYLIST',
	SEARCH = 'SEARCH'
}

export type OnMenuSelectCallback = (item: MainMenuItem) => void;

export class MainMenu extends ParentView {

	private mMenuViews: JQuery[];

	private mOnMenuSelectCallback: OnMenuSelectCallback;

	public constructor() {
		super();
		this.setClass('main-menu');

		const material = (i: string) => `<i class="material-icons">${i}</i>`;

		const homeMenu = $('<button>').addClass('menu');
		homeMenu.html(material('home'));
		homeMenu.addClass('active');
		homeMenu.on('click',
			_ => this.onMenuSelect(homeMenu, MainMenuItem.HOME));
		this.addJQuery(homeMenu);

		const playListMenu = $('<button>').addClass('menu');
		playListMenu.html(material('queue_music'));
		playListMenu.on('click',
			_ => this.onMenuSelect(playListMenu, MainMenuItem.PLAYLIST));
		this.addJQuery(playListMenu);

		const searchMenu = $('<button>').addClass('menu');
		searchMenu.html(material('search'));
		searchMenu.on('click',
			_ => this.onMenuSelect(searchMenu, MainMenuItem.SEARCH));
		this.addJQuery(searchMenu);

		this.mMenuViews = [];
		this.mMenuViews.push(homeMenu, playListMenu, searchMenu);

		this.mOnMenuSelectCallback = (item: MainMenuItem) => { }
	}

	public setOnMenuSelectCallback(callback: OnMenuSelectCallback) {
		this.mOnMenuSelectCallback = callback;
	}

	protected onMenuSelect(menu: JQuery, item: MainMenuItem) {
		this.mMenuViews.forEach(view => {
			if (view === menu) {
				view.addClass('active');
			} else {
				view.removeClass('active');
			}
		});
		this.mOnMenuSelectCallback(item);
	}

}