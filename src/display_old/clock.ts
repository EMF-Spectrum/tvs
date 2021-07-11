import { BaseCanvasItem } from "@/display/base";
import { WIDTH } from "@/display/constants";
import { fontify } from "@/display/fonts";
import { TimerStatus } from "@/types/data";

const COLON_VOFFSET = -20;
const TOTAL_VOFSET = 35; // Random number to fight with the baseline
const TEXT_SIZE = "300px";
const TEXT_WEIGHT = 900;

/**
 * This could probably be done neater but whatever
 */
function timeBreakdown(num: DOMHighResTimeStamp): [number, number, number] {
	let ms = num % 1000;
	let temp = Math.floor(num / 1000);
	let s = temp % 60;
	let m = Math.floor(temp / 60);
	return [m, s, ms];
}

function digit(num: number, which: number): string {
	return (Math.floor(num / 10 ** which) % 10).toFixed(0);
}

export class Clock extends BaseCanvasItem<TimerStatus> {
	public status: TimerStatus;

	private digitWidth: number;
	private colonWidth: number;
	private digitPad: number;
	private colonPad: number;
	private withMinWidth: number;
	private noMinWidth: number;

	private setupText(ctx: CanvasRenderingContext2D): void {
		ctx.font = fontify(TEXT_SIZE, TEXT_WEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
	}

	constructor(ctx: CanvasRenderingContext2D, lastState?: TimerStatus) {
		super(ctx, lastState);

		this.status = lastState ?? { state: "hidden" };

		this.setupText(ctx);

		this.digitWidth = ctx.measureText("0").width;
		this.colonWidth = ctx.measureText(":").width;
		this.digitPad = this.digitWidth;
		this.colonPad = this.colonWidth / 2 + this.digitWidth / 2;
		this.noMinWidth = this.digitPad * 2 + this.colonPad * 2;
		this.withMinWidth = this.digitPad * 3 + this.colonPad * 4;
	}

	getState() {
		return this.status;
	}
	heartbeat(state: TimerStatus) {
		this.status = state;
	}

	render(ctx: CanvasRenderingContext2D): void {
		if (this.status.state == "hidden") {
			return;
		}
		let display: number;
		if (this.status.state == "paused") {
			display = this.status.timeLeft;
		} else {
			display = Math.max(0, this.status.endTime - Date.now());
		}

		this.setupText(ctx);

		let [m, s, ms] = timeBreakdown(display);

		if (m == 0) {
			ctx.translate((WIDTH - this.noMinWidth) / 2, TOTAL_VOFSET);
			ctx.fillStyle = "rgb(200, 0, 0)";
		} else {
			ctx.translate((WIDTH - this.withMinWidth) / 2, TOTAL_VOFSET);
		}

		// ctx.strokeStyle = "red";
		// ctx.strokeRect(hoffset - digitWidth / 2, -100, totalWidth, 200);

		let x = 0;
		if (m != 0) {
			ctx.fillText(digit(m, 1), x, 0);
			x += this.digitPad;
			ctx.fillText(digit(m, 0), x, 0);
			x += this.colonPad;
			ctx.fillText(":", x, COLON_VOFFSET);
			x += this.colonPad;
		}
		ctx.fillText(digit(s, 1), x, 0);
		x += this.digitPad;
		ctx.fillText(digit(s, 0), x, 0);
		x += this.colonPad;
		ctx.fillText(":", x, COLON_VOFFSET);
		x += this.colonPad;
		ctx.fillText(digit(ms, 2), x, 0);
		x += this.digitPad;
		ctx.fillText(digit(ms, 1), x, 0);

		if (this.status.state == "paused") {
			// ctx.font = "bold 400px 'Comic Sans MS'";
			// ctx.fillStyle = "hotpink";
			// ctx.translate(WIDTH / 2 - 200, 0);
			// ctx.rotate(0.35389);
			// ctx.fillText("PAuSED! ", 0, 0);
		}
	}
}
