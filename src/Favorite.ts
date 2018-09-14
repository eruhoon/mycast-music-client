import { Music } from "models/Music";

export class Favorite {

	private static sLength: number = 0;

	private mIdx;
	private mHash;
	private mIcon;
	private mArtist;
	private mTitle;
	private mBitrate;
	private mPlayTime;
	private mUrl;
	private mDom;

	public constructor(music: Music) {
		console.log(music);
		let idx = music.getIndex();
		this.mIdx = idx;
		this.mHash = music.getHash();
		this.mIcon = '/fs/music/thumb/' + idx + '.png';
		this.mArtist = music.getArtist();
		this.mTitle = music.getTitle();
		this.mBitrate = Math.round(music.bitrate / 1000);
		this.mPlayTime = music.playtime;
		this.mUrl = music.url;

		this.mDom = this.createElement();
	}

	private createElement() {

		Favorite.sLength++;

		var entryDom = $(document.createElement('div'))
			.addClass('entry')
			.append([
				$(document.createElement('div'))
					.addClass('artist truncate')
					.text(this.mArtist),
				$(document.createElement('div'))
					.addClass('title brown-text text-lighten-4 truncate')
					.text(this.mTitle)
			]);

		var playtimeDom = $(document.createElement('div'))
			.addClass('playtime right')
			.text(this.mPlayTime)

		var numDom = $(document.createElement('div'))
			.addClass('no right-align left')
			.text(length);

		return $(document.createElement('li'))
			.addClass('collection-item brown darken-3')
			.on({
				click: () => {
					player.play(this);
					return false;
				},
				contextmenu: () => {
					this.removePlayList(this);
					return false;
				}
			})
			.data({ 'instance': this })
			.append([
				$(document.createElement('div'))
					.addClass('playlist-entry left-align')
					.append([
						numDom,
						playtimeDom,
						entryDom,
					])
			]);
	}

	private removePlayList(favoriteInstance) {
		var midx = favoriteInstance.idx;
		$.post('/home/music/listremove', {
			hash: ukey,
			midx: midx
		}, function (res) {
			if (!res) return;
			favoriteInstance.dom.remove();
		});
	}
}







