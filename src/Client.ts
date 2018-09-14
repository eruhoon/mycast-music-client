import { MainController } from "controllers/MainController";
import { Music } from "models/Music";
import { MainActivity } from "views/MainActivity";
import { MusicUploadDialog } from "views/MusicUploadDialog";

export class Client {

	private mMainAcitivity: MainActivity;

	private mKey: string;
	private mMainController: MainController;

	private mMusics: Music[];

	private readonly MAX_FILE_SIZE_MB = 200;
	private FLAG_PLAYLIST_SHOW = false;
	private FLAG_UPLOAD_SHOW = false;
	private FLAG_SEARCH_SHOW = false;

	private FLAG_MUSIC_LENGTH = 50;
	private FLAG_LYRICS_SHOW = true;
	private FLAG_DESKTOP_LYRICS_SHOW = true;
	private FLAG_IS_UPLOADED = false;

	public constructor(key: string) {
		this.mKey = key;
		this.mMainController = new MainController(key);

		this.mMusics = [];
	}

	public main(): void {

		$(document).on({
			dragover: e => {
				e.preventDefault();
			},
			drop: e => {
				e.preventDefault();
				//	this.onDrop(e);
				this.onDrop(e);
			}
		});

		this.mMainAcitivity = new MainActivity(this.mMainController);

		this.mMainController.connect();
	}

	// public uploadProgress(progress) {
	// 	$('#uploadSection>.progress').show();
	// 	$('#uploadSection>.progress>.determinate').css('width', progress + '%');
	// 	if (progress === 100) $('#uploadSection>.progress').hide();
	// }

	// private toggleUploadMenu() {
	// 	let target = $('#uploadContainer');
	// 	let showAnimation = 'slideInDown';
	// 	let hideAnimation = 'slideOutUp';
	// 	if (this.FLAG_UPLOAD_SHOW) {
	// 		new Animation().play(target, hideAnimation, () => {
	// 			target.addClass('upload-container-hide');
	// 			target.removeClass('upload-container');
	// 			target.removeClass('z-depth-3');
	// 			target.css('z-index', 1);
	// 			$('.upload-view-background').hide();
	// 			this.FLAG_UPLOAD_SHOW = false;
	// 		});
	// 	} else {
	// 		target.addClass('upload-container');
	// 		target.removeClass('upload-container-hide');
	// 		target.addClass('z-depth-3');
	// 		target.css('z-index', 3);
	// 		$('.upload-view-background').show();
	// 		new Animation().play(target, showAnimation, () => {
	// 			this.FLAG_UPLOAD_SHOW = true;
	// 		});
	// 	}
	// }



	private onDrop(e: JQuery.Event) {

		let event: any = e.originalEvent;
		let dataTransfer = event.dataTransfer;

		if (!dataTransfer) {
			return false;
		}

		let files: File[] = dataTransfer.files;
		let target: File = null;
		if (files !== null && files.length > 0) {
			for (let file of files) {
				if (!file) return;
				if (file.type.indexOf("audio") !== 0) return;
				console.log(file);

				let dialog = new MusicUploadDialog(this.mKey, file);
				dialog.setMusicUploadHandler(this.mMainController);
				dialog.open();


			}
		}
	}

}
