import { ParentView } from "framework/ParentView";

export type OnListItemClickCallback = () => void;

export class ListItem extends ParentView {

	private mOnListItemClickListener: OnListItemClickCallback;

	public setOnListItemClickListener(listener: OnListItemClickCallback) {
		this.mOnListItemClickListener = listener;
	}

	protected onClick(e: JQuery.Event): boolean {
		this.mOnListItemClickListener();
		return super.onClick(e);
	}
}