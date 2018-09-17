import { IPlayListController } from 'controllers/IPlayListController';
import { Music } from 'models/Music';

import { ListItem } from './ListItem';
import { ListView } from './ListView';
import { PlayListItem } from './PlayListItem';

export class PlayListView extends ListView<Music> {

	private mController: IPlayListController;

	public setController(controller: IPlayListController) {
		this.mController = controller;
	}

	protected bindView(param: Music): ListItem {
		let listItem = new PlayListItem();
		listItem.bind(param);
		listItem.setOnListItemClickListener(() => {
			this.mController.playMusic(param);
		});
		listItem.setOnRemoveButtonClickCallback(() => {
			this.mController.removePlayList(param.getIndex());
		});
		return listItem;
	}
}