import { Music } from "models/Music";

export type UploadMusic = {
	artist: string,
	title: string
	file: File
}

export interface MusicUploadListener {
	onMusicUpload(music: Music): void;
}

export interface IMusicUploadHandler {
	uploadMusic(uploadMusic: UploadMusic): void;
	setMusicUploadListener(listener: MusicUploadListener): void;
}