import { lerp } from "../utils";
import { BaseCanvasItem } from "./base";
import { WIDTH } from "./constants";
import { fontify, OrbitronWeight } from "./fonts";

const TEXT_SIZE = "140px";
const TEXT_SIZE_BIG = "160px";
const MAXIMUM_TERROR = 250;

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

export class TerrorTracker extends BaseCanvasItem {
	private textNormal: TextSizeThing;
	private textBig: TextSizeThing;
	private textPanic: TextSizeThing;
	private gradient: CanvasGradient;

	constructor(ctx: CanvasRenderingContext2D) {
		super(ctx);
		this.textNormal = createTextSizeThing(ctx, TEXT_SIZE, 400, 25);
		this.textBig = createTextSizeThing(ctx, TEXT_SIZE_BIG, 700, 40);

		this.textPanic = createTextSizeThing(ctx, TEXT_SIZE_BIG, 700, 40);
		this.textPanic.width = ctx.measureText("PANIC").width;

		this.gradient = ctx.createLinearGradient(50, 0, WIDTH - 50, 0);

		this.gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
		this.gradient.addColorStop(0.25, "rgba(255, 255, 255, 0)");
		this.gradient.addColorStop(0.75, "rgba(255, 255, 255, 0)");
		this.gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
	}

	private _stage = 1;
	get stage(): number {
		return this._stage;
	}
	set stage(stage: number) {
		if (stage < 0 || stage > MAXIMUM_TERROR) {
			throw new Error("Invalid terror step!");
		}

		this._stage = stage;
	}

	private getStep(step: number): StepInfo | undefined {
		if (step <= 0 || step > MAXIMUM_TERROR) {
			// TODO: "GLOBAL PANIC" final step
			return undefined;
		}
		let tst: TextSizeThing;
		if (step == MAXIMUM_TERROR) {
			tst = this.textPanic;
		} else if (step % 50 == 0) {
			tst = this.textBig;
		} else {
			tst = this.textNormal;
		}

		let text = step.toString();
		if (step == MAXIMUM_TERROR) {
			text = "PANIC";
		}

		let width = tst.width + tst.padding * 2;
		let lerpStep = step / MAXIMUM_TERROR;
		let fillStyle = `rgb(${
			// r
			lerp(150, 255, lerpStep)
		}, ${
			// g
			lerp(150, 0, lerpStep)
		}, ${
			//b
			0
		})`;
		return {
			width,
			text,
			tst,
			fillStyle,
		};
	}

	private getDisplayables(): (StepInfo | undefined)[] {
		// Animation will throw this for a loop but whatever
		const VISIBLES = 3;
		let ret = [];
		for (let i = this.stage - VISIBLES; i <= this.stage + VISIBLES; i++) {
			ret.push(this.getStep(i));
		}
		return ret;
	}

	private drawStep(
		ctx: CanvasRenderingContext2D,
		step: StepInfo,
		centre: number,
	): number {
		ctx.font = step.tst.font;
		ctx.fillStyle = step.fillStyle;
		ctx.fillText(step.text, centre, 0);
		return step.width;
	}

	public render(ctx: CanvasRenderingContext2D): void {
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
