import { WIDTH } from "./constants";
import { fontify } from "./fonts";

export function Phase(ctx: CanvasRenderingContext2D, phase: string): void {
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.font = fontify("180px", 500);
	ctx.fillText(phase, WIDTH / 2, 100);
}
