import { BaseCanvasItem } from "./base";
import { WIDTH } from "./constants";
import { fontify } from "./fonts";

const LEFT_PADDING = 300;
const RIGHT_PADDING = 30;
const TOP_PADDING = 85;

const MAX_WIDTH = WIDTH - LEFT_PADDING - RIGHT_PADDING;

export class PhaseTracker extends BaseCanvasItem {
	public phase = "Setup Phase";

	render(ctx: CanvasRenderingContext2D): void {
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.font = fontify("160px", 500);
		ctx.translate(LEFT_PADDING, TOP_PADDING);

		let { width: textWidth } = ctx.measureText(this.phase);

		let left;
		if (textWidth < MAX_WIDTH) {
			left = (MAX_WIDTH - textWidth) / 2;
		} else {
			left = 0;
		}

		ctx.fillText(this.phase, left, 0, MAX_WIDTH);
	}
}
