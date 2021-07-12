/* eslint-disable @typescript-eslint/no-unused-vars */

export abstract class BaseCanvasItem<S> {
	constructor(ctx: CanvasRenderingContext2D, lastState?: S) {
		// pass
	}

	abstract getState(): S;
	abstract heartbeat(state: S): void;

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

export abstract class BaseHTMLItem<S, E extends HTMLElement> {
	el: E;

	constructor(el: E, lastState?: S) {
		this.el = el;
	}

	abstract getState(): S;
	abstract heartbeat(state: S): void;

	think(frameTime: DOMHighResTimeStamp, now: DOMHighResTimeStamp): void {
		// Do nothing
	}

	onWindowResize(width: number, height: number): void {
		// Do nothing
	}
}
