import { Music } from 'models/Music';

export type MusicLoadCallback = (musics: Music[]) => void;

export interface IMusicPlayHandler {

	playMusic(music: Music): void;
}

export interface IMusicShareHandler {

	shareMusic(music: Music): void;
}

export interface IMusicEntryController
	extends IMusicPlayHandler, IMusicShareHandler {

	addPlayList(music: Music): void;
	deleteMusic(music: Music): void;
	setTags(music: Music, tags: string[],
		onSuccess: (tags: string[]) => void): void;
}

export interface IMusicController {

	loadMusicList(query: string, callback: MusicLoadCallback): void;
}