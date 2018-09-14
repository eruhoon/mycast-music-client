declare let ID3: any;
declare let FileAPIReader: any;

export type Id3Result = {
	title: string,
	artist: string,
	icon: string | null
};

export class Id3Reader {

	public static loadUrl(file: File, callback: Callback<Id3Result>) {

		let opt = {
			tags: ["artist", "title", "album", "year", "comment", "track", "genre", "lyrics", "picture"],
			dataReader: FileAPIReader(file)
		};

		ID3.loadTags(file, () => {

			let tags = ID3.getAllTags(file);

			console.log(tags);
			let artist = tags.artist;
			let title = tags.title;

			let icon = null;
			if (tags.picture !== null) {
				let image = tags.picture;
				let bytes: [] = image.data;
				console.log(bytes);
				let data = bytes.map(b => String.fromCharCode(b)).join('');

				icon = `data:${image.format};base64,${btoa(data)}`;
				/*console.log(data);
				let base64String = "";
				for (let i = 0; i < image.data.length; i++) {
					base64String += String.fromCharCode(image.data[i]);
				}
				console.log(base64String);
				icon = "data:" + image.format + ";base64," + btoa(base64String);
				let icon2 = `data:${image.format};base64,${window.btoa(base64String)}`;*/
				// console.log(icon, icon2);
				//$('#imgUploadThumb').attr('src');
			}

			callback({ artist, title, icon });

		}, opt);
	}

}