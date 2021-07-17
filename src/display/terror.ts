import { BaseHTMLItem } from "@/display/base";
import "./terror.scss";

const MAXIMUM_TERROR = 250;
const TICK_WIDTH = 450;
const NUMBER = Intl.NumberFormat();

export class TerrorTracker extends BaseHTMLItem<number, HTMLOListElement> {
	constructor(el: HTMLOListElement, lastState?: number) {
		super(el);

		el.innerHTML = "";

		for (let i = 1; i <= 250; i++) {
			let tick = document.createElement("li");
			// TODO: "PANIC" text at 250
			tick.textContent = NUMBER.format(i);
			tick.id = "terror-tick-" + i.toFixed(0);
			tick.classList.add("tick");
			el.appendChild(tick);
		}

		if (lastState) {
			this.stage = lastState;
		}
	}

	private _stage = -1;
	get stage(): number {
		return this._stage;
	}
	set stage(stage: number) {
		if (stage < 0 || stage > MAXIMUM_TERROR) {
			throw new Error("Invalid terror step!");
		} else if (stage == this._stage) {
			return;
		}

		if (stage == 0) {
			this.el.classList.remove("-visible");
			this._stage = stage;
			return;
		} else if (this._stage < 1) {
			this.el.classList.add("-visible");
			this._stage = stage;
			this.onWindowResize(window.innerWidth, window.innerHeight);
			return;
		}

		// TODO: Ideally the speed should be based on distance to be traveled,
		//       not whatever the hell this calculation is
		// let currentOffset = window.getComputedStyle(this.el).left;
		let transitionSpeed = (Math.abs(stage - this._stage) / 125) * 9 + 1;

		this._stage = stage;

		let newOffset = this.calculatePosition();
		this.el.style.left = `${newOffset.toFixed(2)}px`;
		this.el.style.transitionDuration = `${transitionSpeed.toFixed(2)}s`;
	}

	private calculatePosition(): number {
		if (this._stage < 1) {
			return 0;
		}

		let tick = this.el.querySelector<HTMLLIElement>(
			"#terror-tick-" + this._stage.toFixed(0),
		);
		if (!tick) {
			throw new Error("Missing terror tick?");
		}

		return (window.innerWidth - TICK_WIDTH) / 2 - tick.offsetLeft;
	}

	public onWindowResize(_width: number, _height: number) {
		let newOffset = this.calculatePosition();
		this.el.style.left = `${newOffset.toFixed(2)}px`;
		// No transition to avoid visual jank
		this.el.style.transitionDuration = `0s`;
	}

	getState() {
		return this.stage;
	}

	heartbeat(state: number) {
		this.stage = state;
	}
}
