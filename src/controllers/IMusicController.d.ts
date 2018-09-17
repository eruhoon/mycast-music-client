import { Music } from 'models/Music';
import { IMusicUploadHandler } from 'handlers/IMusicUploadHandler';

export type MusicLoadCallback = (musics: Music[]) => void;

export interface IMusicPlayHandler {

	playMusic(music: Music): void;
}

export interface IMusicShareHandler {

	shareMusic(music: Music): void;
}

export interface IMusicEntryController
	extends IMusicPlayHandler, IMusicShareHandler, IMusicUploadHandler {

	addPlayList(music: Music): void;
	removeMusic(music: Music): void;
	setTags(music: Music, tags: string[],
		onSuccess: (tags: string[]) => void): void;
}

export interface IMusicController {

	loadMusicList(query: string, callback: MusicLoadCallback): void;
	loadMusicListCache(query: string, callback: MusicLoadCallback): void;
}