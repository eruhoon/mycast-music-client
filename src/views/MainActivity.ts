import { MainController } from 'controllers/MainController';
import { BaseActivity } from 'framework/BaseActivity';
import { ParentView } from 'framework/ParentView';

import { HomeTabView } from './HomeTabView';
import { IBackgroundView } from './IBackgroundView';
import { IMainView } from './IMainView';
import { MainMenu, MainMenuItem } from './MainMenu';
import { MusicListTab } from './MusicSearchTab';
import { PlayerView } from './PlayerView';
import { PlayListTab } from './PlayListTab';

export class MainActivity extends BaseActivity
	implements IMainView, IBackgroundView {

	private mBackgroundView: JQuery;
	private mMainMenu: MainMenu;
	private mHomeView: HomeTabView;
	private mPlayListTab: PlayListTab;
	private mMusicSearchTab: MusicListTab;
	private mPlayerView: PlayerView;

	private mController: MainController;

	public constructor(controller: MainController) {
		super('main');
		this.setClass('main-activity');

		this.mBackgroundView = $('<div>').addClass('background');
		this.addJQuery(this.mBackgroundView);

		const prevBackground = $('<img>');
		prevBackground.appendTo(this.mBackgroundView);

		const currentBackground = $('<img>');
		currentBackground.attr('src', '/home/resource/img/music/bg.jpg');
		currentBackground.appendTo(this.mBackgroundView);

		let mainView = new ParentView();
		mainView.setClass('container');
		this.addView(mainView);

		this.mMainMenu = new MainMenu();
		this.mMainMenu.appendTo(mainView);
		this.mMainMenu.setOnMenuSelectCallback(item => this.onMenuSelect(item));

		let tabsView = new ParentView();
		tabsView.setClass('tab-list-view');
		mainView.addView(tabsView);

		this.mHomeView = new HomeTabView();
		tabsView.addView(this.mHomeView);

		this.mPlayListTab = new PlayListTab();
		this.mPlayListTab.hide();
		tabsView.addView(this.mPlayListTab);

		this.mMusicSearchTab = new MusicListTab(controller);
		this.mMusicSearchTab.setMusicEntryController(controller);
		this.mMusicSearchTab.hide();
		tabsView.addView(this.mMusicSearchTab);

		this.mPlayerView = new PlayerView(controller);
		this.mPlayerView.appendTo(mainView);

		this.mController = controller;

		this.init();
	}

	public init() {
		this.mController.setPlayerView(this.mPlayerView);
		this.mController.setPlayListView(this.mPlayListTab);
		this.mController.setBackgroundView(this);

		this.mPlayListTab.setPlayListController(this.mController);

		this.mController.loadPlayList();
	}

	public setBackground(background: string) {

		let prevView = this.mBackgroundView.children().eq(0);
		let nextView = this.mBackgroundView.children().eq(1);

		prevView.attr('src', nextView.attr('src'));
		prevView.show().fadeOut(400);
		nextView.hide().fadeIn(400);
		nextView.attr('src', background);
	}

	protected onMenuSelect(item: MainMenuItem) {
		switch (item) {
			case MainMenuItem.PLAYLIST:
				this.mHomeView.hide();
				this.mPlayListTab.show();
				this.mMusicSearchTab.hide();
				break;
			case MainMenuItem.SEARCH:
				this.mHomeView.hide();
				this.mPlayListTab.hide();
				this.mMusicSearchTab.show();
				break;
			case MainMenuItem.HOME:
			default:
				this.mHomeView.show();
				this.mPlayListTab.hide();
				this.mMusicSearchTab.hide();
		}
	}
}