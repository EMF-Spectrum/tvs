export abstract class BaseCanvasItem {
	constructor(ctx: CanvasRenderingContext2D) {
		// pass
	}

	abstract render(
		ctx: CanvasRenderingContext2D,
		frameTime: DOMHighResTimeStamp,
		now: DOMHighResTimeStamp,
	): void;

	public doRender(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		frameTime: DOMHighResTimeStamp,
		now: DOMHighResTimeStamp,
	): void {
		ctx.save();
		ctx.translate(x, y);
		this.render(ctx, frameTime, now);
		ctx.restore();
	}
}
