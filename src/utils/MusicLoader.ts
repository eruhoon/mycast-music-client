import { Lyrics } from "models/Lyrics";
import { MusicParam, Music } from "models/Music";

export type RawLyrics = {
	result: boolean,
	idx: number,
	response: Lyrics
}

export type LyricsLoadCallback = (lyrics: Lyrics | null) => void;

export type PlayListLoadCallback = (playList: Music[]) => void;

export class MusicLoader {

	public loadLyrics(idx: number, callback: LyricsLoadCallback) {
		let url = '/home/music/lyrics/';
		$.post(url, { idx }, (res: RawLyrics) => {
			if (res.result) {
				callback(res.response);
			} else {
				callback(null);
			}
		}, 'json');
	}

	public loadPlayList(userHash: string, callback: PlayListLoadCallback) {
		let url = '/home/music/playlist/';
		$.post(url, { hash: userHash }, res => {
			const params: MusicParam[] = res;
			callback(params.map(param => new Music(param)));
		}, 'json');
	}

}