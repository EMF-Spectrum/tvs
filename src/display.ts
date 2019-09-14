import { Clock } from "@/display/clock";
import { WIDTH, HEIGHT } from "@/display/constants";

let canvas = document.getElementById("root") as HTMLCanvasElement;
if (!canvas) {
	throw new Error("gimme me my canvas");
}
let ctx = canvas.getContext("2d")!;
if (!ctx) {
	throw new Error("??");
}

let TEMPend = performance.now() + 20 * 60 * 1000;

function anime(now: DOMHighResTimeStamp): void {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);

	ctx.save();
	ctx.translate(0, HEIGHT / 2);
	Clock(ctx, Math.max(0, TEMPend - now));
	ctx.restore();

	ctx.strokeStyle = "red";
	ctx.moveTo(0, HEIGHT / 2);
	ctx.lineTo(WIDTH, HEIGHT / 2);
	ctx.stroke();
	window.requestAnimationFrame(anime);
}

window.requestAnimationFrame(anime);
