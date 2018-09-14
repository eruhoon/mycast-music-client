import { Music } from "models/Music";

export interface IFavoriteController {
	addFavorite(music: Music): void;
	removeFavorite(music: Music): void;
}