import { BaseHTMLItem } from "@/display/base";
import { fontify } from "@/display/fonts";
import { TimerStatus } from "@/types/data";
import { ContextExclusionPlugin } from "webpack";
import "./clock.scss";

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

export class Clock extends BaseHTMLItem<TimerStatus, HTMLCanvasElement> {
	public status: TimerStatus;

	private digitWidth: number;
	private colonWidth: number;
	private digitPad: number;
	private colonPad: number;
	private withMinWidth: number;
	private noMinWidth: number;

	private ctx: CanvasRenderingContext2D;
	private canvasWidth = 0;
	private canvasHeight = 0;

	private setupText(ctx: CanvasRenderingContext2D): void {
		ctx.font = fontify(TEXT_SIZE, TEXT_WEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
	}

	private setupCanvas(): CanvasRenderingContext2D {
		let canvas = this.el;
		// Get the device pixel ratio, falling back to 1.
		let dpr = window.devicePixelRatio || 1;

		// Get the size of the canvas in CSS pixels.
		let rect = canvas.getBoundingClientRect();
		// Give the canvas pixel dimensions of their CSS
		// size * the device pixel ratio.
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;

		this.canvasWidth = canvas.width;
		this.canvasHeight = canvas.height;

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		let ctx = canvas.getContext("2d", { alpha: false })!;
		// let ctx = canvas.getContext("2d")!;

		return ctx;
	}

	constructor(el: HTMLCanvasElement, lastState?: TimerStatus) {
		super(el, lastState);

		this.ctx = this.setupCanvas();

		this.status = lastState ?? { state: "hidden" };

		this.setupText(this.ctx);

		this.digitWidth = this.ctx.measureText("0").width;
		this.colonWidth = this.ctx.measureText(":").width;
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

	public onWindowResize(_width: number, _height: number) {
		this.ctx = this.setupCanvas();
	}

	render(
		ctx: CanvasRenderingContext2D,
		ft: DOMHighResTimeStamp,
		now: DOMHighResTimeStamp,
	): void {
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
			ctx.translate(
				(this.canvasWidth - this.noMinWidth) / 2,
				TOTAL_VOFSET,
			);
			ctx.fillStyle = "rgb(200, 0, 0)";
		} else {
			ctx.translate(
				(this.canvasWidth - this.withMinWidth) / 2,
				TOTAL_VOFSET,
			);
		}

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
			ctx.font = "bold 400px 'Comic Sans MS'";
			ctx.fillStyle = "hotpink";
			ctx.translate(this.canvasWidth / 2 - 300, 0);
			ctx.rotate(0.1 * Math.sin(now / 1000));
			ctx.fillText("PAuSED! ", 0, 0);
		}
	}

	think(ft: DOMHighResTimeStamp, now: DOMHighResTimeStamp): void {
		let ctx = this.ctx;

		ctx.save();
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
		ctx.restore();

		ctx.save();
		ctx.translate(0, this.canvasHeight / 2);
		this.render(ctx, ft, now);
		ctx.restore();
	}
}
