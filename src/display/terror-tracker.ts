import { WIDTH } from "./constants";
import { fontify } from "./fonts";
import { S_IXGRP, SSL_OP_CRYPTOPRO_TLSEXT_BUG } from "constants";

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
	padding: number,
): TextSizeThing {
	let font = fontify(fontSize);
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
}

export class TerrorTracker {
	private textNormal: TextSizeThing;
	private textBig: TextSizeThing;
	public stage: number;

	constructor(ctx: CanvasRenderingContext2D) {
		this.textNormal = createTextSizeThing(ctx, TEXT_SIZE, 25);
		this.textBig = createTextSizeThing(ctx, TEXT_SIZE_BIG, 40);
		this.stage = 1;
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
		return {
			width,
			text,
			tst,
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
		ctx.fillText(step.text, centre, 0);
		return step.width;
	}

	draw(ctx: CanvasRenderingContext2D): void {
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
