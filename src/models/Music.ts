export type MusicParam = {
	idx: number;
	hash: string;
	title: string;
	artist: string;
	bitrate: number;
	playtime: string;
	url?: string;
	tag: string[];
};

export class Music {

	private mIdx: number;
	private mHash: string;
	private mIcon: string;
	private mArtist: string;
	private mTitle: string;
	private mBitrate: number;
	private mPlaytime: string;
	private mUrl: string;
	private mTags: string[];

	public constructor(param: MusicParam) {

		this.mIdx = param.idx;
		this.mHash = param.hash;
		this.mIcon = `/fs/music/thumb/${param.idx}.png`;
		this.mArtist = param.artist;
		this.mTitle = param.title;
		this.mBitrate = param.bitrate;
		this.mPlaytime = param.playtime;
		this.mUrl = param.url || `/fs/music/${param.hash}.mp3`;
		this.mTags = param.tag || [];

	}

	public getHash(): string { return this.mHash; }

	public getIcon(): string { return this.mIcon; }

	public getUrl(): string { return this.mUrl; }

	public getIndex(): number { return this.mIdx; }

	public getArtist(): string { return this.mArtist; }

	public getTitle(): string { return this.mTitle; }

	public getBitrate(): number { return this.mBitrate; }

	public getPlayTime(): string { return this.mPlaytime; }

	public getTag(): string[] { return this.mTags; }
}