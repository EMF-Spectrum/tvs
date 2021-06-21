import { Socket } from "@/common/socket";
import { BaseCanvasItem } from "@/display/base";
import { Clock } from "@/display/clock";
import { HEIGHT, WIDTH } from "@/display/constants";
import { loadFonts } from "@/display/fonts";
import { PhaseTracker } from "@/display/phase";
import { TerrorTracker } from "@/display/terror";
import { Ticker } from "@/display/ticker";
import { TurnTracker } from "@/display/turn";

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

	ctx.canvas.addEventListener("click", async () => {
		try {
			await ctx.canvas.requestFullscreen({ navigationUI: "hide" });
		} catch (e) {
			alert(e);
		}
	});

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

	function makeCanvas<T extends BaseCanvasItem<any>>(
		Cls: new (...args: any[]) => T,
		prev?: T,
	): T {
		return new Cls(ctx, prev?.getState());
	}

	let clock = makeCanvas(Clock);
	let turnTracker = makeCanvas(TurnTracker);
	let phaseTracker = makeCanvas(PhaseTracker);
	let terrorTracker = makeCanvas(TerrorTracker);
	let ticker = makeCanvas(Ticker);

	if (module.hot) {
		module.hot.accept("@/display/clock", () => {
			clock = makeCanvas(Clock, clock);
		});
		module.hot.accept("@/display/turn", () => {
			turnTracker = makeCanvas(TurnTracker, turnTracker);
		});
		module.hot.accept("@/display/phase", () => {
			phaseTracker = makeCanvas(PhaseTracker, phaseTracker);
		});
		module.hot.accept("@/display/terror", () => {
			terrorTracker = makeCanvas(TerrorTracker, terrorTracker);
		});
		module.hot.accept("@/display/ticker", () => {
			ticker = makeCanvas(Ticker, ticker);
		});
		module.hot.accept(["@/display/constants", "@/display/fonts"]);
	}

	sock.on("heartbeat", (data) => {
		let { phase, terror, timer, turn } = data;
		turnTracker.heartbeat(turn);
		phaseTracker.heartbeat(phase);
		terrorTracker.heartbeat(terror);
		clock.heartbeat(timer);
	});

	let last = performance.now();
	function anime(now: DOMHighResTimeStamp): void {
		let ft = now - last;
		last = now;

		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		fps(ctx, ft);

		clock.doRender(ctx, 0, HEIGHT / 2, ft, now);
		turnTracker.doRender(ctx, 30, 30, ft, now);
		phaseTracker.doRender(ctx, 300, 85, ft, now);
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
