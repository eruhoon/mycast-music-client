import { IPlayListController } from 'controllers/IPlayListController';
import { ParentView } from 'framework/ParentView';
import { Music } from 'models/Music';

import { IPlayListView } from './IPlayListView';
import { PlayListView } from './PlayListView';

export class PlayListTab extends ParentView implements IPlayListView {

	public mListView: PlayListView;

	public constructor() {
		super();

		this.setClass('playlist-tab-view');

		this.mListView = new PlayListView();
		this.addView(this.mListView);

	}

	public setPlayListController(controller: IPlayListController) {
		this.mListView.setController(controller);
	}

	public setPlayListItems(musics: Music[]): void {
		this.mListView.bind(musics);
	}

	public addPlayListItem(music: Music): void {
		this.mListView.addItem(music);
	}

	public removePlayListItem(idx: number): void {
		this.mListView.removeItem(idx);
	}

}