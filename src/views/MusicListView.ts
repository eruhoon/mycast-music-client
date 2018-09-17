import {
	IMusicController, IMusicEntryController, MusicLoadCallback
} from 'controllers/IMusicController';
import { MusicController } from 'controllers/MusicController';
import { Toast } from 'framework/Toast';
import { MusicUploadListener } from 'handlers/IMusicUploadHandler';
import { Music } from 'models/Music';

import { ListItem } from './ListItem';
import { ListView } from './ListView';
import { MusicView } from './MusicView';

export class MusicListView
	extends ListView<Music> implements MusicUploadListener {

	private static readonly DEFAULT_CAPACITY: number = 50;
	private static readonly DEFAULT_CAPACITY_DELTA: number = 50;

	private mMusicController: IMusicController;
	private mMusicEntryController: IMusicEntryController;
	private mSearchQuery: string;
	private mCapacity: number;

	public constructor() {
		super();
		this.setClass('music-list-view');

		this.mSearchQuery = '';
		this.mCapacity = MusicListView.DEFAULT_CAPACITY;
		this.mMusicController = new MusicController();
		this.mMusicEntryController = null;

		this.init();
	}

	public init() {
		this.loadMusic();
	}

	public onMusicUpload(music: Music): void {
		new Toast('업로드 완료했습니다.').toast();
		this.loadMusic(true);
	}

	public setSearchQuery(query: string) {

		if (this.mSearchQuery !== query) {
			this.mCapacity = MusicListView.DEFAULT_CAPACITY;
		}

		this.mSearchQuery = query;
		this.loadMusic();
	}

	public setMusicEntryController(controller: IMusicEntryController) {
		this.mMusicEntryController = controller;
		this.mMusicEntryController.setMusicUploadListener(this);
	}

	private loadMusic(enforced: boolean = false) {

		let callback: MusicLoadCallback = musics => {
			const displayMusics = musics.filter((e, i) => i < this.mCapacity);
			this.bind(displayMusics);
		};

		if (enforced) {
			this.mMusicController.loadMusicList(this.mSearchQuery, callback);
		} else {
			this.mMusicController.loadMusicListCache(
				this.mSearchQuery, callback);
		}

	}

	protected bindView(item: Music): ListItem {
		const view = new MusicView(this.mMusicEntryController);
		view.bind(item);
		return view;
	}

	protected onScroll(): boolean {
		const scrollValue = this.getScrollTop() + this.getHeight();
		if (scrollValue + 200 > this.getScrollHeight()) {
			this.expandCapacity();
		}
		return true;
	}

	private expandCapacity() {
		if (this.getCount() < this.mCapacity) {
			return;
		}

		this.mCapacity += MusicListView.DEFAULT_CAPACITY_DELTA;
		this.onCapacityExpanded();
	}

	private onCapacityExpanded() {
		this.loadMusic();
	}
}
