import { BaseView } from "framework/BaseView";
import { DivisionView } from "./DivisionView";

export class ParentView extends DivisionView {

	public constructor() {
		super();
	}

	public addView(view: BaseView) {
		view.appendTo(this);
	}

}