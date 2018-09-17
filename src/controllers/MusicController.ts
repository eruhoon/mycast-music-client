import { IMusicController, MusicLoadCallback } from "./IMusicController";
import { MusicParam, Music } from "models/Music";

export class MusicController implements IMusicController {

	private mMusics: Music[] = null;

	public loadMusicList(query: string, callback: MusicLoadCallback) {
		$.post('/home/music/musiclist/', (params: MusicParam[]) => {
			this.mMusics = params.map(param => new Music(param));
			callback(this.searchMusic(query));
		}, 'json');
	}

	public loadMusicListCache(query: string, callback: MusicLoadCallback) {
		if (this.mMusics === null) {
			this.loadMusicList(query, callback);
		} else {
			callback(this.searchMusic(query));
		}
	}

	private searchMusic(query: string): Music[] {
		query = query.toLowerCase();
		return this.mMusics.filter(musicEntry => {
			let title = musicEntry.getTitle();
			let artist = musicEntry.getArtist();
			let tag = musicEntry.getTag();
			return (title.toLowerCase().search(query) !== -1 ||
				artist.toLowerCase().search(query) !== -1 ||
				tag.join().toLowerCase().search(query) !== -1)
		});
	}
}