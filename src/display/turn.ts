import { fontify } from "./fonts";

export function Turn(ctx: CanvasRenderingContext2D, turn: number): void {
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.translate(150, 0);

	const TURN_BOX = 240;

	ctx.strokeStyle = "black";
	ctx.lineWidth = 10;
	ctx.strokeRect(-TURN_BOX / 2, -TURN_BOX / 2, TURN_BOX, TURN_BOX);

	ctx.font = fontify("72px", 500);
	ctx.fillText("Turn", 0, -65);
	ctx.font = fontify("150px", 700);
	ctx.fillText(turn.toFixed(0), 0, 55);
}
