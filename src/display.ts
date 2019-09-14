import { Clock } from "@/display/clock";
import { WIDTH, HEIGHT } from "@/display/constants";
import { loadFonts } from "@/display/fonts";
import { join } from "path";

function getCtx(): CanvasRenderingContext2D {
	let canvas = document.getElementById("root") as HTMLCanvasElement;
	if (!canvas) {
		throw new Error("gimme me my canvas");
	}
	let ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("??");
	}

	return ctx;
}

function showLoading(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.font = "300px 'comic sans ms'";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Loading!!1", WIDTH / 2, HEIGHT / 2);
	ctx.restore();
}

function showLoadingFailure(ctx: CanvasRenderingContext2D, error: Error): void {
	console.error("Loady fail: ", error);
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.font = "300px 'comic sans ms'";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "red";
	ctx.fillText("Failed to load :(", WIDTH / 2, HEIGHT / 2, WIDTH);
}

async function main(): Promise<void> {
	let fontsLoaded = loadFonts();

	let ctx = getCtx();

	try {
		showLoading(ctx);
		await fontsLoaded;
	} catch (e) {
		showLoadingFailure(ctx, e);
		return;
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
}
main();
