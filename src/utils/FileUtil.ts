export class FileUtil {
	public save(fileUrl: string, fileName: string) {

		let windowWrapper: any = window;

		// for non-IE
		if (!windowWrapper.ActiveXObject) {
			var save = document.createElement('a');
			save.href = fileUrl;
			save.target = '_blank';
			save.download = fileName || 'unknown';

			var event = document.createEvent('Event');
			event.initEvent('click', true, true);
			save.dispatchEvent(event);
			(window.URL || windowWrapper.webkitURL).revokeObjectURL(save.href);
		}

		// for IE
		else if (!!windowWrapper.ActiveXObject && document.execCommand) {
			var _window = window.open(fileUrl, '_blank');
			_window.document.close();
			_window.document.execCommand('SaveAs', true, fileName || fileUrl)
			_window.close();
		}

	}
}