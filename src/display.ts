import { Socket } from "@/common/socket";
import { BaseHTMLItem } from "@/display/base";
import { Clock } from "@/display/clock";
import { loadFonts } from "@/display/fonts";
import "@/display/main.scss";
import { PhaseTracker } from "@/display/phase";
import { TerrorTracker } from "@/display/terror";
import { Ticker } from "@/display/ticker";
import { TurnTracker } from "@/display/turn";

async function main(): Promise<void> {
	let fontsLoaded = loadFonts();

	document.body.addEventListener("click", async () => {
		try {
			await document.body.requestFullscreen({ navigationUI: "hide" });
		} catch (e) {
			alert(e);
		}
	});

	let sockURL = new URL("/socket", window.location.href);
	sockURL.protocol = "ws";
	let sock = new Socket(sockURL.href);

	let socketReady = sock.connect();

	try {
		// TODO: Loading text
		await Promise.all([fontsLoaded, socketReady]);
	} catch (e) {
		// TODO: Loading error
		alert(e);
		// eslint-disable-next-line no-debugger
		debugger;
		return;
	}

	function makeHTML<T extends BaseHTMLItem<any, any>>(
		qs: string,
		Cls: new (...args: any[]) => T,
		prev?: T,
	): T {
		let el = document.querySelector(qs);
		if (!el) {
			throw new Error("missing element!!1");
		}
		return new Cls(el, prev?.getState());
	}

	let clock = makeHTML("#clock-canvas", Clock);
	let turnTracker = makeHTML(".turn-tracker", TurnTracker);
	let phaseTracker = makeHTML(".phase-tracker", PhaseTracker);
	let terrorTracker = makeHTML(".terror-tracker", TerrorTracker);
	let ticker = makeHTML(".news-ticker", Ticker);

	if (module.hot) {
		module.hot.accept("@/display/clock", () => {
			clock = makeHTML("#clock-canvas", Clock, clock);
		});
		module.hot.accept("@/display/turn", () => {
			turnTracker = makeHTML(".turn-tracker", TurnTracker, turnTracker);
		});
		module.hot.accept("@/display/phase", () => {
			phaseTracker = makeHTML(
				".phase-tracker",
				PhaseTracker,
				phaseTracker,
			);
		});
		module.hot.accept("@/display/terror", () => {
			terrorTracker = makeHTML(
				".terror-tracker",
				TerrorTracker,
				terrorTracker,
			);
		});
		module.hot.accept("@/display/ticker", () => {
			ticker = makeHTML(".news-ticker", Ticker, ticker);
		});
		module.hot.accept(["@/display/fonts"]);
	}

	sock.on("heartbeat", (data) => {
		let { phase, terror, timer, turn } = data;
		turnTracker.heartbeat(turn);
		phaseTracker.heartbeat(phase);
		terrorTracker.heartbeat(terror);
		clock.heartbeat(timer);
	});

	window.addEventListener("resize", () => {
		let width = window.innerWidth;
		let height = window.innerHeight;
		turnTracker.onWindowResize(width, height);
		phaseTracker.onWindowResize(width, height);
		terrorTracker.onWindowResize(width, height);
		clock.onWindowResize(width, height);
	});

	let last = performance.now();
	function think(now: DOMHighResTimeStamp): void {
		let ft = now - last;
		last = now;

		clock.think(ft, now);
		turnTracker.think(ft, now);
		phaseTracker.think(ft, now);
		terrorTracker.think(ft, now);
		ticker.think(ft, now);

		window.requestAnimationFrame(think);
	}

	window.requestAnimationFrame(think);
}
main();
