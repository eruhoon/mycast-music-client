import { Toast } from 'framework/Toast';
import { IMusicUploadHandler, UploadMusic } from 'handlers/IMusicUploadHandler';
import { Music } from 'models/Music';
import { PlayCategory } from 'models/PlayCategory';
import { RepeatMode } from 'models/Player';
import { PlayState } from 'models/PlayState';
import { MusicLoader } from 'utils/MusicLoader';
import { BackgroundView } from 'views/BackgroundView';
import { IBackgroundView } from 'views/IBackgroundView';
import { IMainView } from 'views/IMainView';
import { IPlayListView } from 'views/IPlayListView';
import { PlayerView } from 'views/PlayerView';
import { WebSocketNetworkModel } from 'WebSocketNetworkModel';

import { IFavoriteController } from './IFavoriteController';
import { IMusicEntryController } from './IMusicController';
import { INetworkController } from './INetworkController';
import { IPlayListController } from './IPlayListController';
import { IMusicListView } from 'views/IMusicListView';

export class MainController
	implements INetworkController, IFavoriteController,
	IPlayListController, IMusicEntryController, IMusicUploadHandler {

	private mHash: string;

	private mPlayItems: Music[];
	private mNetworkModel: WebSocketNetworkModel;
	private mAudio: HTMLAudioElement;
	private mNowPlay: Music | null;
	private mShuffleMode: boolean;
	private mRepeatMode: RepeatMode;

	private mMainView: IMainView;
	private mPlayerView: PlayerView;
	private mMusicListView: IMusicListView;
	private mPlayListView: IPlayListView;
	private mBackgroundView: IBackgroundView;

	public constructor(hash: string) {

		this.mHash = hash;

		this.mPlayItems = [];

		this.mNetworkModel = new WebSocketNetworkModel(hash);

		this.mAudio = new Audio();
		this.mAudio.volume = 1;
		this.mAudio.onplay = () => this.onPlay();
		this.mAudio.onpause = () => this.onPause();
		this.mAudio.onended = () => this.onEnded();
		this.mAudio.ontimeupdate = () => {
			if (this.mAudio.paused) {
				return;
			}
			this.onProgress();
		}

		this.mNowPlay = null;
		this.mShuffleMode = true
		this.mRepeatMode = RepeatMode.NONE;

		this.mBackgroundView = new BackgroundView();
	}

	public loadPlayList() {
		new MusicLoader().loadPlayList(this.mHash, musics => {
			this.mPlayItems = musics;
			this.mPlayListView.setPlayListItems(musics);
		});
	}

	public addPlayList(music: Music): void {
		let url = '/home/music/listadd/';
		let midx = music.getIndex();
		$.post(url, { hash: this.mHash, midx: midx }, (result: boolean) => {
			if (result) {
				this.mPlayListView.addPlayListItem(music);
				new Toast('곡을 재생목록에 담았습니다.').toast();
			} else {
				new Toast('이미 추가된 음악입니다.').toast();
			}
		}, 'json');
	}

	public addFavorite(music: Music): void {
		let url = '/home/music/listadd/';
		let midx = music.getIndex();
		$.post(url, { hash: this.mHash, midx: midx }, res => {
			if (!res) return;
			this.mPlayListView.addPlayListItem(music);
		});
	}

	public removePlayList(idx: number): void {
		let url = '/home/music/listremove';
		$.post(url, { hash: this.mHash, midx: idx }, (res) => {
			if (!res) return;
			let itemIdx = this.mPlayItems.findIndex(
				item => item.getIndex() === idx);
			if (itemIdx === -1) return;
			this.mPlayListView.removePlayListItem(itemIdx);
		});
	}

	public removeFavorite(music: Music): void {
		let midx = music.getIndex();
		$.post('/home/music/listremove', {
			hash: this.mHash,
			midx: midx
		}, function (res) {
			if (!res) return;
			//favoriteInstance.dom.remove();
		});
	}

	public connect() {
		this.mNetworkModel.connect();
	}

	public isMute(): boolean {
		return this.mAudio.muted;
	}

	public setMute(mute: boolean): void {
		this.mAudio.muted = mute;
		this.mPlayerView.setMute(mute);
	}

	public setCategory(category: PlayCategory) {
		// this.mCategory = category;
	}

	public setMusicListView(view: IMusicListView) {
		this.mMusicListView = view;
	}

	public setPlayerView(playerView: PlayerView) {
		this.mPlayerView = playerView;
	}

	public setPlayListView(view: IPlayListView) {
		this.mPlayListView = view;
	}

	public setBackgroundView(view: IBackgroundView) {
		this.mBackgroundView = view;
	}

	public setVolume(volume: number) {
		this.mAudio.volume = volume / 100;
		this.mPlayerView.setVolume(volume);
	}

	public playPrev() {

	}

	public playMusic(music: Music) {
		this.mNowPlay = music;
		this.mAudio.src = music.getUrl();
		this.mAudio.play();
		this.mPlayerView.setMusicInfo(this.mNowPlay);
		this.mPlayerView.setPlayState(PlayState.PLAY);
		this.mBackgroundView.setBackground(music.getIcon());

		this.loadLyrics();
	}

	public pause() {
		if (this.mNowPlay === null) {
			console.error('No Playing Music');
			return;
		}

		if (this.mAudio.paused) {
			this.mAudio.play();
			this.mPlayerView.setPlayState(PlayState.PLAY);
		} else {
			this.mAudio.pause();
			this.mPlayerView.setPlayState(PlayState.PAUSE);
		}
	}

	public stopMusic() {
		if (this.mNowPlay === null) {
			console.error('No Playing Music');
			return;
		}

		this.mAudio.load();
		this.mNowPlay = null;
		this.mPlayerView.init();
	}

	public nextMusic() {
		if (this.mNowPlay === null) {
			console.warn('No Playing Music');
			return;
		}

		//this.mAudio.load();

	}

	public seek(offset: number) {
		if (this.mNowPlay === null) {
			console.error('No Playing Music');
			return;
		}

		let duration: number = this.mAudio.duration;
		this.mAudio.currentTime = duration * offset;
	}

	public isShuffleMode(): boolean { return this.mShuffleMode; }

	public setShuffleMode(shuffleMode: boolean) {
		this.mShuffleMode = shuffleMode;
		this.mPlayerView.setShuffleMode(shuffleMode);
	}

	public getRepeatMode(): RepeatMode { return this.mRepeatMode; }

	public setRepeatMode(repeatMode: RepeatMode): void {
		this.mRepeatMode = repeatMode;
		this.mPlayerView.setRepeatMode(repeatMode);
	}

	public shareNowPlaying() {
		if (this.mNowPlay === null) {
			console.error('No Playing Music');
			return;
		}
		this.mNetworkModel.callMusicChat(this.mNowPlay.getHash());
	}

	public shareMusic(music: Music) {
		this.mNetworkModel.callMusicChat(music.getHash());
	}

	public uploadMusic(entry: UploadMusic): void {
		let url = '/home/music/upload';
		const formData = new FormData();
		formData.append('artist', entry.artist);
		formData.append('hash', entry.uploaderHash);
		formData.append('title', entry.title);
		formData.append('file', entry.file);

		$.ajax({
			contentType: false,
			data: formData,
			processData: false,
			type: 'POST',
			url: url,
			dataType: 'json'
		}).done(data => {

			if (!data || !data.result) {
				console.error('Failed to upload music');
				return;
			}
			console.log(data);
			new Toast('업로드 완료했습니다.').toast();
		});
	}

	public deleteMusic(music: Music) {
		const strconfirm = confirm('Are you sure you want to delete?');
		if (strconfirm !== true) return;
		$.post('/home/music/delete/', { hash: music.getHash() }, res => {
			console.log(res);
		});
	}

	public setTags(
		music: Music, tags: string[], onSuccess: (tags: string[]) => void) {

		let url = '/home/music/settag/';
		$.post(url, { midx: music.getIndex(), tag: tags }, (res) => {
			if (!res || !res.result) return;
			onSuccess(res.response);
		}, 'json');
	}

	private loadLyrics() {
		if (this.mNowPlay === null) {
			console.warn('No Playing Music');
			return;
		}

		const loader = new MusicLoader();
		loader.loadLyrics(this.mNowPlay.getIndex(), lyrics => {
			if (lyrics === null) {
				return;
			}
			this.mPlayerView.setLyrics(lyrics);
		});
	}

	private onPlay() {
		console.log('onPlay');
	}

	private onPause() {
		console.log('onPause');
	}

	private onEnded() {
		this.mPlayerView.setPlayState(PlayState.INIT);

		switch (this.mRepeatMode) {
			case RepeatMode.ONE:
				this.playMusic(this.mNowPlay);
				break;
			case RepeatMode.ALL:
				this.playNext();
		}
	}

	private onProgress() {
		const currentTime = this.mAudio.currentTime;
		const current = Math.floor(currentTime);
		this.mPlayerView.setCurrentTime(current);
		this.mPlayerView.setDuration(this.mAudio.duration);
	}

}