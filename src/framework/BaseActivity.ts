import { BaseView } from "./BaseView";

export abstract class BaseActivity extends BaseView {

	public constructor(id: string) {
		super(`#${id}`);
	}

	public addView(view: BaseView) {
		view.appendTo(this);
	}
}