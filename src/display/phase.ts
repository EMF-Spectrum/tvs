import { BaseHTMLItem } from "@/display/base";
import "./phase.scss";

enum Doing {
	IN,
	OUT,
	STATIC,
}

const DELETING_SPEED = 50;
const TYPING_SPEED = 100;

export class PhaseTracker extends BaseHTMLItem<string, HTMLHeadingElement> {
	constructor(el: HTMLHeadingElement, lastState?: string) {
		super(el, lastState);

		// bypass any typing
		if (lastState) {
			this.el.textContent = lastState;
			this._phase = lastState;
			this.cPhase = lastState;
		}
	}

	private mode: Doing = Doing.STATIC;

	private actionTimer = 0;
	private _phase = "";
	private cPhase = "";
	public get phase(): string {
		return this._phase;
	}
	public set phase(newP: string) {
		if (newP == this._phase) {
			return;
		}
		if (!this._phase) {
			// First phase, typewriter it all in
			this.mode = Doing.IN;
			this.cPhase = "";
			this.actionTimer = 0;
		} else {
			if (this.mode == Doing.STATIC) {
				// Just in case it isn't already for some reason
				this.cPhase = this._phase;
				this.actionTimer = 0;
			}
			this.mode = Doing.OUT;
		}
		this._phase = newP;
	}

	getState() {
		return this.phase;
	}

	heartbeat(state: string) {
		this.phase = state;
	}

	private doTyping(ft: DOMHighResTimeStamp): void {
		if (this.mode == Doing.STATIC) {
			return;
		}
		this.actionTimer += ft;
		if (this.mode == Doing.OUT) {
			if (this.actionTimer < DELETING_SPEED) {
				return;
			}
			this.actionTimer = 0;
			this.cPhase = this.cPhase.substr(0, this.cPhase.length - 1);
			if (this.cPhase == "") {
				this.mode = Doing.IN;
			}
		} else {
			if (this.actionTimer < TYPING_SPEED) {
				return;
			}
			this.actionTimer = 0;
			this.cPhase = this._phase.substr(0, this.cPhase.length + 1);
			if (this.cPhase == this._phase) {
				this.mode = Doing.STATIC;
			}
		}
	}

	/** @override */
	think(ft: DOMHighResTimeStamp, _now: DOMHighResTimeStamp): void {
		if (this.mode == Doing.STATIC) {
			return;
		}

		this.doTyping(ft);

		this.el.textContent = this.cPhase;
	}
}
