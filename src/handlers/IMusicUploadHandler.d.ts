export type UploadMusic = {
	artist: string,
	uploaderHash: string,
	title: string
	file: File
}
export interface IMusicUploadHandler {
	uploadMusic(uploadMusic: UploadMusic): void;
}