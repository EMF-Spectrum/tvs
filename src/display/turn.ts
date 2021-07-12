import { BaseHTMLItem } from "@/display/base";
import "./turn.scss";

export class TurnTracker extends BaseHTMLItem<number, HTMLDivElement> {
	private state: number;

	constructor(el: HTMLDivElement, lastState?: number) {
		super(el, lastState);

		this.state = lastState ?? 0;
	}

	getState() {
		return this.state;
	}

	heartbeat(state: number) {
		this.state = state;

		// TODO: This should be a nice transition
		let n = this.el.querySelector<HTMLSpanElement>(".number");
		if (n) {
			n.textContent = state.toFixed(0);
		}
	}
}
