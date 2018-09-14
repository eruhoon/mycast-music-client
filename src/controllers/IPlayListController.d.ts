import { Music } from "models/Music";

export class IPlayListController {
	playMusic(music: Music): void;
	removePlayList(idx: number): void;
}