import { BaseCanvasItem } from "@/display/base";
import { WIDTH } from "@/display/constants";
import { fontify } from "@/display/fonts";

const LEFT_PADDING = 300;
const RIGHT_PADDING = 30;

const MAX_WIDTH = WIDTH - LEFT_PADDING - RIGHT_PADDING;

enum Doing {
	IN,
	OUT,
	STATIC,
}

const DELETING_SPEED = 50;
const TYPING_SPEED = 100;

export class PhaseTracker extends BaseCanvasItem {
	private mode: Doing = Doing.STATIC;

	// constructor(ctx: CanvasRenderingContext2D) {
	// 	super(ctx);
	// }
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

	render(ctx: CanvasRenderingContext2D, ft: DOMHighResTimeStamp): void {
		if (!this._phase && this.mode == Doing.STATIC) {
			return;
		}

		this.doTyping(ft);

		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.font = fontify("160px", 500);

		let { width: textWidth } = ctx.measureText(this.cPhase);

		let left;
		if (textWidth < MAX_WIDTH) {
			left = (MAX_WIDTH - textWidth) / 2;
		} else {
			left = 0;
		}

		ctx.fillText(this.cPhase, left, 0, MAX_WIDTH);
	}
}
