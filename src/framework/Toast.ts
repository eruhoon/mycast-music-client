import { BaseObject } from "./BaseObject";

export class Toast extends BaseObject {

	private $: JQuery<HTMLDivElement>;

	public constructor(text: string) {
		super();

		this.$ = $<HTMLDivElement>('<div>').text(text);
		this.$.css({
			position: 'fixed',
			left: 0,
			top: '80%',
			minWidth: '100px',
			maxWidth: '80vw',
			padding: '5px 20px',
			borderRadius: '10px',
			transform: 'translate(calc(50vw - 50%), 0)',
			background: '#585858',
			color: 'white',
			opacity: 0.7,
		})
	}

	public toast() {
		this.$.appendTo($('body'));
		this.$.fadeIn(200, () => {
			setTimeout(() => {
				this.$.fadeOut(400, () => this.$.remove());
			}, 1000);
		});
	}
}