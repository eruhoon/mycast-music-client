import { BaseDialog } from 'framework/BaseDialog';
import { ParentView } from 'framework/ParentView';
import { Toast } from 'framework/Toast';
import { IMusicUploadHandler, UploadMusic } from 'handlers/IMusicUploadHandler';
import { Id3Reader, Id3Result } from 'utils/Id3Reader';

type MusicUploadResponse = {
	artist: string,
	bitrate: string,
	hash: string,
	idx: string,
	playtime: string,
	tag: string,
	tags: string,
	title: string,
	uploader_idx: string,
};

export class MusicUploadDialog extends BaseDialog {

	private mUploadHandler: IMusicUploadHandler;
	private mFile: File;

	private mIconView: JQuery;
	private mTitleInput: JQuery;
	private mArtistInput: JQuery;

	public constructor(file: File) {
		super();
		this.setClass('music-upload-dialog');
		this.setIcon('playlist_add');
		this.setTitle('음악 추가');

		let iconWrapper = new ParentView();
		iconWrapper.setClass('icon');

		this.mIconView = $('<img>');
		iconWrapper.addJQuery(this.mIconView);
		this.addView(iconWrapper);

		let artistInfoView = new ParentView();
		artistInfoView.setClass('info');
		let artistLabel = $('<div>').addClass('label').text('가수');
		this.mArtistInput = $('<input>');
		artistInfoView.addJQuery(artistLabel);
		artistInfoView.addJQuery(this.mArtistInput);
		this.addView(artistInfoView);

		let titleInfoView = new ParentView();
		titleInfoView.setClass('info');
		let titleLabel = $('<div>').addClass('label').text('제목');
		this.mTitleInput = $('<input>');
		titleInfoView.addJQuery(titleLabel);
		titleInfoView.addJQuery(this.mTitleInput);
		this.addView(titleInfoView);

		let uploadButton = $('<button>').text('추가');
		uploadButton.one('click', _ => { this.onUploaClick(); });
		this.addButton(uploadButton);

		this.mFile = file;
		Id3Reader.loadUrl(file, id3 => this.onDataLoad(id3));
	}

	public setMusicUploadHandler(handler: IMusicUploadHandler) {
		this.mUploadHandler = handler;
	}

	protected onDataLoad(id3: Id3Result) {
		this.mIconView.attr('src', id3.icon);
		this.mArtistInput.val(id3.artist);
		this.mTitleInput.val(id3.title);
	}

	protected onUploaClick() {

		let entry: UploadMusic = {
			artist: this.mArtistInput.val().toString(),
			title: this.mTitleInput.val().toString(),
			file: this.mFile
		}

		this.mUploadHandler.uploadMusic(entry);

		this.dismiss();
	}

}