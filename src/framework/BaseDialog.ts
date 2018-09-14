import { BaseObject } from "./BaseObject";
import { BaseView } from "./BaseView";
import { ParentView } from "./ParentView";

export class BaseDialog extends BaseObject {

	private $: JQuery;
	private mBackground: JQuery;
	private mDialogView: ParentView;
	private mTitleBarIconView: JQuery;
	private mTitleBarTextView: JQuery;
	private mBodyWrapper: JQuery;
	private mButtonWrapper: ParentView;

	public constructor() {
		super();
		this.$ = $('<div>');
		this.$.addClass('base-dialog');

		this.mBackground = $('<div>').addClass('background');
		this.mBackground.on('click', _ => { this.dismiss() });
		this.$.append(this.mBackground);

		this.mDialogView = new ParentView();
		this.mDialogView.setClass('dialog');
		this.mDialogView.appendTo(this.$);

		let titleBar = $('<div>').addClass('title-bar');
		this.mDialogView.addJQuery(titleBar);

		this.mTitleBarIconView = $('<i class="material-icons"></i>');
		this.mTitleBarIconView.text('info');
		this.mTitleBarIconView.appendTo(titleBar);

		this.mTitleBarTextView = $('<div>').addClass('title')
		this.mTitleBarTextView.appendTo(titleBar);

		this.mBodyWrapper = $('<div>').addClass('body-wrapper');
		this.mDialogView.addJQuery(this.mBodyWrapper);

		this.mButtonWrapper = new ParentView();
		this.mButtonWrapper.setClass('button-wrapper');
		this.mDialogView.addView(this.mButtonWrapper);
	}

	public setIcon(icon: string) {
		this.mTitleBarIconView.text(icon);
	}

	public setTitle(title: string) {
		this.mTitleBarTextView.text(title);
	}

	public setClass(className: string) {
		this.$.attr('class', className);
	}

	public addView(view: BaseView) {
		view.appendTo(this.mBodyWrapper);
	}

	public addButton(button: JQuery) {
		this.mButtonWrapper.addJQuery(button);
	}

	public open() {
		this.$.hide();
		this.$.appendTo($('body'));
		this.$.fadeIn(300);
	}

	public dismiss() {
		this.remove();
	}

	public remove() {
		this.$.remove();
	}
}