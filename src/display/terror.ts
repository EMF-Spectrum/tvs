import { BaseCanvasItem } from "@/display/base";
import { WIDTH } from "@/display/constants";
import { fontify, OrbitronWeight } from "@/display/fonts";
import { lerp } from "@/utils";
import BezierEasing from "bezier-easing";

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
	step: number;
}

interface Colour {
	r: number;
	g: number;
	b: number;
}

const COLOUR_1: Colour = { r: 39, g: 194, b: 53 };
const COLOUR_50: Colour = { r: 215, g: 215, b: 67 };
const COLOUR_250: Colour = { r: 255, g: 0, b: 0 };
const COLOUR_200: Colour = { r: 218, g: 68, b: 19 };

function lerpColour(c1: Colour, c2: Colour, amt: number): Colour {
	return {
		r: lerp(c1.r, c2.r, amt),
		b: lerp(c1.b, c2.b, amt),
		g: lerp(c1.g, c2.g, amt),
	};
}

export class TerrorTracker extends BaseCanvasItem {
	private textNormal: TextSizeThing;
	private textBig: TextSizeThing;
	private textPanic: TextSizeThing;
	private gradient: CanvasGradient;

	private steps: StepInfo[] = [];

	private easing = BezierEasing(0.33, -0.15, 0.63, 1.35);

	constructor(ctx: CanvasRenderingContext2D) {
		super(ctx);
		this.textNormal = createTextSizeThing(ctx, TEXT_SIZE, 400, 25);
		this.textBig = createTextSizeThing(ctx, TEXT_SIZE_BIG, 700, 40);
		// this.textNormal.padding = this.textBig.padding;
		this.textNormal.width = this.textBig.width;

		this.textPanic = createTextSizeThing(ctx, TEXT_SIZE_BIG, 700, 40);
		this.textPanic.width = ctx.measureText("PANIC").width;

		// this.gradient = ctx.createLinearGradient(50, 0, WIDTH - 50, 0);
		this.gradient = ctx.createLinearGradient(0, 0, WIDTH, 0);

		this.gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
		this.gradient.addColorStop(0.15, "rgba(255, 255, 255, 0)");
		this.gradient.addColorStop(0.85, "rgba(255, 255, 255, 0)");
		this.gradient.addColorStop(1, "rgba(255, 255, 255, 1)");

		for (let i = 1; i <= MAXIMUM_TERROR; i++) {
			this.steps.push(this.getStep(i));
		}
		this.stage = 1;
	}

	private stepTimer = 0;
	private stepSpeed = 1;
	private stepOffset = 0;
	private targetOffset = NaN;
	private _stage = -1;
	get stage(): number {
		return this._stage;
	}
	set stage(stage: number) {
		if (stage < 1 || stage > MAXIMUM_TERROR) {
			throw new Error("Invalid terror step!");
		} else if (stage == this._stage) {
			return;
		}

		// this.stepOffset
		let targetOffset = this.steps.reduce((offset, step) => {
			if (step.step > stage) {
				return offset;
			} else if (step.step == stage) {
				return offset - step.width / 2;
			}
			return offset - step.width;
		}, 0);

		if (isNaN(this.targetOffset)) {
			this.stepOffset = targetOffset;
			this.targetOffset = targetOffset;
		} else {
			this.targetOffset = targetOffset;
			this.stepTimer = 0;
			this.stepSpeed = (Math.abs(stage - this._stage) / 125) * 9 + 1;
		}

		this._stage = stage;
	}

	private getStep(step: number): StepInfo {
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
		let target: Colour;
		if (step < 50) {
			target = lerpColour(COLOUR_1, COLOUR_50, step / 50);
		} else if (step < 200) {
			target = lerpColour(COLOUR_50, COLOUR_200, (step - 50) / 150);
		} else {
			target = lerpColour(COLOUR_200, COLOUR_250, (step - 200) / 50);
		}

		let fillStyle = `rgb(${target.r},${target.g},${target.b})`;
		return {
			width,
			text,
			tst,
			fillStyle,
			step,
		};
	}

	private drawStep(
		ctx: CanvasRenderingContext2D,
		step: StepInfo,
		offset: number,
	): number {
		let res = offset + step.width;
		if (res > 0 && offset < WIDTH) {
			ctx.font = step.tst.font;
			ctx.fillStyle = step.fillStyle;
			ctx.fillText(step.text, offset + step.width / 2, 0);
			if (step.step < MAXIMUM_TERROR) {
				ctx.moveTo(res + 2.5, 0);
				ctx.lineTo(res + 2.5, -120);
				ctx.stroke();
			}
		}
		return res;
	}

	public getOffset(ft: DOMHighResTimeStamp) {
		if (this.targetOffset == this.stepOffset) {
			return this.stepOffset;
		}
		this.stepTimer += ft / (1000 * this.stepSpeed);
		if (this.stepTimer >= 1) {
			this.stepOffset = this.targetOffset;
			return this.stepOffset;
		}
		let gap = this.targetOffset - this.stepOffset;
		return this.stepOffset + this.easing(this.stepTimer) * gap;
	}

	public render(
		ctx: CanvasRenderingContext2D,
		ft: DOMHighResTimeStamp,
	): void {
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";

		let centre = WIDTH / 2;
		let offset = centre + this.getOffset(ft);
		ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 10;

		for (let step of this.steps) {
			offset = this.drawStep(ctx, step, offset);
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
