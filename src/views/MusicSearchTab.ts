import { ParentView } from "framework/ParentView";
import { MusicListView } from "./MusicListView";
import { IMusicEntryController } from "controllers/IMusicController";
import { MusicUploadDialog } from "./MusicUploadDialog";
import { IMusicSearchController } from "controllers/IMusicSearchController";

export class MusicListTab extends ParentView {

	private mController: IMusicSearchController;
	private mMusicListView: MusicListView;

	private mTimer: number;

	public constructor(controller: IMusicSearchController) {
		super();

		let searchIcon = $('<i>').addClass('material-icons').text('search');

		let searchEditor = $('<input>');
		searchEditor.on('keyup', () => {
			let query = searchEditor.val().toString();
			this.onSearchQueryChanged(query);
		});

		let searchMenu = $('<div>').addClass('search-menu');
		searchMenu.append([searchIcon, searchEditor]);

		let uploadButton = $('<button>').addClass('add-music-button');
		uploadButton.html('<i class="material-icons">add</i>');
		uploadButton.on('click', _ => this.onUploadButtonClick());

		this.mMusicListView = new MusicListView();
		this.mTimer = -1;

		this.setClass('music-list-tab');
		this.addJQuery(searchMenu);
		this.addView(this.mMusicListView);
		this.addJQuery(uploadButton);

		this.mController = controller;
	}

	public setMusicEntryController(controller: IMusicEntryController) {
		this.mMusicListView.setMusicEntryController(controller);
	}

	public onSearchQueryChanged(query: string) {
		if (this.mTimer !== -1) {
			clearTimeout(this.mTimer);
		}

		this.mTimer = setTimeout(() => {
			this.mMusicListView.setSearchQuery(query);
		}, 500);
	}

	protected onUploadButtonClick() {

		let inputButton = $('<input type="file" accept="audio/*">');
		inputButton.on('change', e => {
			let element: any = inputButton[0];
			let file: File = element.files[0];
			if (file.type.indexOf('audio') !== 0) return;

			let dialog = new MusicUploadDialog(file);
			dialog.setMusicUploadHandler(this.mController);
			dialog.open();

		});
		inputButton.trigger('click');
		//const dialog = new MusicUploadDialog();
		//dialog.open();
	}

}