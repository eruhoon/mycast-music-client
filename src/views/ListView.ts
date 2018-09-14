import { BaseView } from "framework/BaseView";
import { ListItem } from "./ListItem";

export abstract class ListView<Item> extends BaseView<HTMLDivElement> {

	private mListItems: ListItem[];

	public constructor() {
		super('<div>');

		this.mListItems = [];
	}

	public bind(params: Item[]) {
		this.removeAllChildView();
		params.forEach(param => {
			const listItem = this.bindView(param);
			this.addListItem(listItem);
		});
	}

	public addItem(item: Item) {
		let listItem = this.bindView(item);
		this.addListItem(listItem);
	}

	public removeItem(idx: number) {
		this.removeListItem(idx);
	}

	public removeAllChildView(): void {
		this.mListItems = this.mListItems.filter(view => {
			view.remove();
			return false;
		});
	}

	public getCount(): number {
		return this.mListItems.length;
	}

	protected onScroll(): boolean {
		return true;
	}

	protected abstract bindView(item: Item): ListItem;

	private addListItem(listItem: ListItem) {
		this.mListItems.push(listItem);
		listItem.appendTo(this);
	}

	private removeListItem(idx: number) {
		let view = this.mListItems[idx];
		this.mListItems.splice(idx, 1);
		view.remove();
	}
}
