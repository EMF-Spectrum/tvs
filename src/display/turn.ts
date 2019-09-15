import { fontify } from "./fonts";

const PADDING = 30;

export function Turn(ctx: CanvasRenderingContext2D, turn: number): void {
	ctx.textAlign = "center";
	ctx.textBaseline = "top";

	ctx.translate(PADDING, PADDING);

	const TURN_BOX = 240;

	ctx.strokeStyle = "black";
	ctx.lineWidth = 10;
	ctx.strokeRect(0, 0, TURN_BOX, TURN_BOX);

	ctx.font = fontify("72px", 500);
	ctx.fillText("Turn", TURN_BOX / 2, 20);
	ctx.font = fontify("150px", 700);
	ctx.fillText(turn.toFixed(0), TURN_BOX / 2, 95);
}
