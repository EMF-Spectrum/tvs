import { Clock } from "./display/clock";
import { WIDTH, HEIGHT } from "./display/constants";
import { loadFonts } from "./display/fonts";
import { join } from "path";
import { Turn } from "./display/turn";
import { Phase } from "./display/phase";

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

function fps(ctx: CanvasRenderingContext2D, ft: DOMHighResTimeStamp): void {
	let fps = 1 / (ft / 1000);
	let fpsText = `${fps.toFixed(0)}fps`;
	let ftText = `${ft.toFixed(1)}ms`;

	const padding = 5;

	ctx.save();
	ctx.font = "10pt Consolas";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillStyle = "black";
	ctx.fillText(fpsText, WIDTH - padding, padding);
	ctx.fillText(ftText, WIDTH - padding, padding + 13);
	ctx.restore();
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

	let last = performance.now();
	function anime(now: DOMHighResTimeStamp): void {
		let ft = now - last;
		last = now;

		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		fps(ctx, ft);

		ctx.save();
		ctx.translate(0, HEIGHT / 2);
		Clock(ctx, Math.max(0, TEMPend - now));
		ctx.restore();

		ctx.save();
		ctx.translate(0, 0);
		Turn(ctx, 8);
		ctx.restore();

		ctx.save();
		Phase(ctx, "Diplomacy Phase");
		ctx.restore();

		// ctx.strokeStyle = "red";
		// ctx.moveTo(0, HEIGHT / 2);
		// ctx.lineTo(WIDTH, HEIGHT / 2);
		// ctx.stroke();

		window.requestAnimationFrame(anime);
	}

	window.requestAnimationFrame(anime);
}
main();
