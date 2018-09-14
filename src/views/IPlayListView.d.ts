import { Music } from "models/Music";

export interface IPlayListView {
	setPlayListItems(musics: Music[]): void;
	addPlayListItem(music: Music): void;
	removePlayListItem(idx: number): void;
}