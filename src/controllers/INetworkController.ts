import { Music } from "models/Music";

export interface INetworkController {
	connect(): void;
	shareNowPlaying(): void;
	shareMusic(music: Music): void;
}