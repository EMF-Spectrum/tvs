export abstract class BaseCanvasItem {
	constructor(ctx: CanvasRenderingContext2D) {}

	abstract render(ctx: CanvasRenderingContext2D): void;
}
