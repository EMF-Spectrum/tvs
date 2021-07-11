import { BaseCanvasItem } from "@/display/base";
import { fontify } from "@/display/fonts";

export class TurnTracker extends BaseCanvasItem<number> {
	public turn: number;

	constructor(ctx: CanvasRenderingContext2D, lastState?: number) {
		super(ctx, lastState);

		this.turn = lastState ?? 0;
	}

	getState() {
		return this.turn;
	}

	heartbeat(state: number) {
		this.turn = state;
	}

	render(ctx: CanvasRenderingContext2D): void {
		ctx.textAlign = "center";
		ctx.textBaseline = "top";

		const TURN_BOX = 240;

		ctx.strokeStyle = "black";
		ctx.lineWidth = 10;
		ctx.strokeRect(0, 0, TURN_BOX, TURN_BOX);

		ctx.font = fontify("72px", 500);
		ctx.fillText("Turn", TURN_BOX / 2, 20);
		ctx.font = fontify("150px", 700);
		ctx.fillText(this.turn.toFixed(0), TURN_BOX / 2, 95);
	}
}
