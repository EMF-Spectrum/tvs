import { Clock } from "./display/clock";
import { HEIGHT, WIDTH } from "./display/constants";
import { loadFonts } from "./display/fonts";
import { PhaseTracker } from "./display/phase";
import { TerrorTracker } from "./display/terror-tracker";
import { Ticker } from "./display/ticker";
import { TurnTracker } from "./display/turn";
import { HeartbeatEvent } from "./types/data";
import { Socket } from "./common/socket";

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

	let sockURL = new URL("/socket", window.location.href);
	sockURL.protocol = "ws";
	let sock = new Socket(sockURL.href);

	let socketReady = sock.connect();

	try {
		showLoading(ctx);
		await Promise.all([fontsLoaded, socketReady]);
	} catch (e) {
		showLoadingFailure(ctx, e);
		return;
	}

	let clock = new Clock(ctx);
	let turnTracker = new TurnTracker(ctx);
	let phaseTracker = new PhaseTracker(ctx);
	let terrorTracker = new TerrorTracker(ctx);
	let ticker = new Ticker(ctx);

	sock.on("heartbeat", (data) => {
		let { phase, terror, timer, turn } = data;
		turnTracker.turn = turn;
		phaseTracker.phase = phase;
		terrorTracker.stage = terror;
		clock.status = timer;
	});

	let last = performance.now();
	function anime(now: DOMHighResTimeStamp): void {
		let ft = now - last;
		last = now;

		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		fps(ctx, ft);

		clock.doRender(ctx, 0, HEIGHT / 2, ft, now);
		turnTracker.doRender(ctx, 0, 0, ft, now);
		phaseTracker.doRender(ctx, 0, 0, ft, now);
		terrorTracker.doRender(ctx, 0, HEIGHT - 100, ft, now);
		ticker.doRender(ctx, 0, HEIGHT - 100, ft, now);

		// ctx.strokeStyle = "red";
		// ctx.moveTo(0, HEIGHT / 2);
		// ctx.lineTo(WIDTH, HEIGHT / 2);
		// ctx.stroke();

		window.requestAnimationFrame(anime);
	}

	window.requestAnimationFrame(anime);
}
main();
