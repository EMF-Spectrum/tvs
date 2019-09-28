import { WIDTH } from "./constants";
import { fontify, OrbitronWeight } from "./fonts";
import { S_IXGRP, SSL_OP_CRYPTOPRO_TLSEXT_BUG } from "constants";
import { BaseCanvasItem } from "./base";

const TEXT_SIZE = "140px";
const TEXT_SIZE_BIG = "160px";
const TEXT_WEIGHT = 400;
const PADDING = 50;

interface TextSizeThing {
	width: number;
	font: string;
	padding: number;
}

function createTextSizeThing(
	ctx: CanvasRenderingContext2D,
	fontSize: string,
	weight: OrbitronWeight,
	padding: number,
): TextSizeThing {
	let font = fontify(fontSize, weight);
	ctx.font = font;
	let width = ctx.measureText("000").width;
	return {
		font,
		width,
		padding,
	};
}

interface StepInfo {
	width: number;
	text: string;
	tst: TextSizeThing;
	fillStyle: string;
}

function lerp(start: number, end: number, step: number): number {
	step /= 240;
	return (1 - step) * start + step * end;
}

export class TerrorTracker extends BaseCanvasItem {
	private textNormal: TextSizeThing;
	private textBig: TextSizeThing;
	public stage: number;
	private gradient: CanvasGradient;

	constructor(ctx: CanvasRenderingContext2D) {
		super(ctx);
		this.textNormal = createTextSizeThing(ctx, TEXT_SIZE, 400, 25);
		this.textBig = createTextSizeThing(ctx, TEXT_SIZE_BIG, 700, 40);
		this.stage = 1;
		this.gradient = ctx.createLinearGradient(50, 0, WIDTH - 50, 0);

		// this.gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
		// // this.gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.9)");
		// this.gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.8)");
		// this.gradient.addColorStop(0.3333, "rgba(255, 255, 255, 0)");
		// this.gradient.addColorStop(0.6666, "rgba(255, 255, 255, 0)");
		// this.gradient.addColorStop(0.75, "rgba(255, 255, 255, 0.8)");
		// // this.gradient.addColorStop(0.75, "rgba(255, 255, 255, 0.8)");
		// this.gradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");

		this.gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
		// this.gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.9)");
		this.gradient.addColorStop(0.25, "rgba(255, 255, 255, 0)");
		// this.gradient.addColorStop(0.3333, "rgba(255, 255, 255, 0)");
		// this.gradient.addColorStop(0.4, "rgba(255, 255, 255, 0)");
		// this.gradient.addColorStop(0.6, "rgba(255, 255, 255, 0)");
		this.gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
		// this.gradient.addColorStop(0.6666, "rgba(255, 255, 255, 0)");
		this.gradient.addColorStop(0.75, "rgba(255, 255, 255, 0)");
		this.gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
	}

	getStep(step: number): StepInfo | undefined {
		if (step <= 0 || step > 240) {
			// TODO: GLOBAL PANIC
			return undefined;
		}
		let tst: TextSizeThing;
		if (step % 50 == 0) {
			tst = this.textBig;
		} else {
			tst = this.textNormal;
		}
		// let text = "000";
		let text = step.toString();
		let width = tst.width + tst.padding * 2;
		let fillStyle = `rgb(${lerp(150, 255, step)},${lerp(150, 0, step)}, 0)`;
		return {
			width,
			text,
			tst,
			fillStyle,
		};
	}

	getDisplayables(): (StepInfo | undefined)[] {
		// Animation will throw this for a loop but whatever
		const VISIBLES = 3;
		let ret = [];
		for (let i = this.stage - VISIBLES; i <= this.stage + VISIBLES; i++) {
			ret.push(this.getStep(i));
		}
		return ret;
	}

	drawStep(
		ctx: CanvasRenderingContext2D,
		step: StepInfo,
		centre: number,
	): number {
		ctx.font = step.tst.font;
		ctx.fillStyle = step.fillStyle;
		ctx.fillText(step.text, centre, 0);
		return step.width;
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";

		let centre = WIDTH / 2;

		let steps = this.getDisplayables();

		// Ha ha ha good fucking luck with your animations
		let CURRENT_STEP = steps[3];
		let x: number;
		let lastWidth: number;
		x = centre;
		let firstWidth = this.drawStep(ctx, CURRENT_STEP!, x);

		ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 10;

		lastWidth = firstWidth;
		for (let i = 1; i <= 3; i++) {
			CURRENT_STEP = steps[3 + i];
			if (!CURRENT_STEP) {
				break;
			}
			x += lastWidth / 2;
			ctx.moveTo(x + 2.5, 0);
			ctx.lineTo(x + 2.5, -120);
			ctx.stroke();
			x += CURRENT_STEP.width / 2;
			lastWidth = this.drawStep(ctx, CURRENT_STEP, x);
		}

		x = centre;
		lastWidth = firstWidth;
		for (let i = 1; i <= 3; i++) {
			CURRENT_STEP = steps[3 - i];
			if (!CURRENT_STEP) {
				break;
			}
			x -= lastWidth / 2;
			ctx.moveTo(x - 2.5, 0);
			ctx.lineTo(x - 2.5, -120);
			ctx.stroke();
			x -= CURRENT_STEP.width / 2;
			lastWidth = this.drawStep(ctx, CURRENT_STEP, x);
		}

		ctx.fillStyle = this.gradient;
		ctx.fillRect(0, -200, WIDTH, 200);

		ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 10;
		ctx.moveTo(0, 0);
		ctx.lineTo(WIDTH, 0);
		ctx.stroke();
	}
}
/*

function drawStep(
	ctx: CanvasRenderingContext2D,
	step: number,
	centre: number,
): number {
	let fontSize = TEXT_SIZE;
	if (step % 50 == 0) {
		fontSize = TEXT_SIZE_BIG;
	}
	ctx.font = fontify(fontSize, TEXT_WEIGHT);

	let numberWidth = ctx.measureText("000").width;

	ctx.fillText("000", centre, 0);
	// ctx.fillText(step.toString(), centre, 0);

	return numberWidth + PADDING;
}

export function TerrorTracker(
	ctx: CanvasRenderingContext2D,
	stage: number,
): void {
}

	// for (let i = 0; i < 20; i++) {
	// 	ctx.fillText((i + 1).toFixed(0), numberWidth * i, 0);
	// }

	// ctx.fillStyle = "red";
	// ctx.fillText("1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10", WIDTH / 2, 0);
	// ctx.fillText("Diplomacy Phase", 0, 0);
}

*/
