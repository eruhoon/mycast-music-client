import { IMusicEntryController } from 'controllers/IMusicController';

import { BaseMusicView } from './BaseMusicView';
import { Music } from 'models/Music';

export class MusicView extends BaseMusicView {

	private mController: IMusicEntryController;
	private mMusic: Music;
	private mAlterIcon: string;

	public constructor(controller: IMusicEntryController) {
		super();

		this.mController = controller;
	}

	public bind(music: Music) {
		this.mMusic = music;
		this.mAlterIcon = `/home/music/albumart/${music.getIndex()}`;
		super.bind(music);
	}

	protected onClick() {
		return false;
	}

	protected onIconError() {
		this.setIcon(this.mAlterIcon);
	}

	protected onPlayButtonClick() {
		this.mController.playMusic(this.mMusic);
	}

	protected onAddFavoriteButtonClick() {
		this.mController.addPlayList(this.mMusic);
	}

	protected onShareButtonClick() {
		this.mController.shareMusic(this.mMusic);
	}

	protected onDeleteButtonClick() {
		this.mController.deleteMusic(this.mMusic);
	}
	protected onDownloadButtonClick() {
		this.downloadFile();
	}

	protected onTagEditorSubmit(query: string) {
		let tags = query.replace(/ /g, '').split(',');
		this.mController.setTags(this.mMusic, tags, result => {
			console.log(result);
			this.setTags(result);
		});
	}

	private downloadFile() {
		let url = `/fs/music/${this.mMusic.getHash()}.mp3`;
		window.open(url);
	}


}
