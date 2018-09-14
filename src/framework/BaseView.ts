export enum ViewAnimation {
	NONE = 'NONE',
	FADE_IN = 'FADE_IN',
	FADE_OUT = 'FADE_OUT'
}

export type OnScrollCallback = (event: JQuery.Event) => void;

export const enum ViewEvent {
	CLICK = 'click',
	MOUSEENTER = 'mouseenter',
	MOUSELEAVE = 'mouseleave'
}

export abstract class BaseView<T extends HTMLElement = HTMLElement> {

	private $: JQuery<T>;

	public constructor(selector: string) {
		this.$ = $(selector);
		this.$.on('click', e => this.onClick(e));
		this.$.on('contextmenu', e => this.onContextMenu(e));

		this.$[0].addEventListener('mousewheel', e => {
			return this.onScroll();
		}, { passive: true });

		this.$[0].addEventListener('scroll', e => {
			return this.onScroll();
		}, { passive: true });
	}

	public setEventHandler(event: ViewEvent, handler: JQuery.EventHandler<T>) {
		this.$.on(event, handler);
	}

	public setClass(className: string) {
		this.$.attr('class', className);
	}

	public getHeight(): number {
		return this.$.height();
	}

	public getScrollTop(): number {
		return parseFloat(this.$.prop('scrollTop'));
	}

	public getScrollHeight(): number {
		return parseFloat(this.$.prop('scrollHeight'));
	}

	public appendTo(view: BaseView | JQuery): void {
		if (view instanceof BaseView) {
			this.$.appendTo(view.$);
		} else {
			this.$.appendTo(view);
		}
	}

	public addJQuery(child: JQuery) {
		this.$.append(child);
	}

	public remove(animation: ViewAnimation = ViewAnimation.NONE) {

		switch (animation) {
			case ViewAnimation.FADE_OUT:
				this.$.fadeOut(200, () => { this.$.remove(); });
				return;

			case ViewAnimation.NONE:
			default:
				this.$.remove();
				return;
		}
	}

	public show(animation: ViewAnimation = ViewAnimation.NONE) {
		switch (animation) {
			case ViewAnimation.FADE_IN:
				this.$.fadeIn();
				break;
			case ViewAnimation.NONE:
			default:
				this.$.show();
		}
	}

	public hide(animation: ViewAnimation = ViewAnimation.NONE) {
		switch (animation) {
			case ViewAnimation.FADE_OUT:
				this.$.fadeOut();
				break;
			case ViewAnimation.NONE:
			default:
				this.$.hide();
		}
	}

	protected onClick(_e: JQuery.Event): boolean { return true; }

	protected onContextMenu(_e: JQuery.Event): boolean { return true; }

	protected onScroll(): boolean { return true; }

}