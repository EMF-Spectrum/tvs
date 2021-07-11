import { Socket } from "@/common/socket";
import { loadFonts } from "@/display/fonts";
import "@/display/main.scss";

const TICKER_TEXT = [
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
];

const NUMBER = Intl.NumberFormat();

function setupTerror(tt: HTMLOListElement): void {
	for (let i = 1; i <= 250; i++) {
		let tick = document.createElement("li");
		tick.textContent = NUMBER.format(i);
		tick.id = "terror-tick-" + i.toString();
		tick.classList.add("tick");
		tt.appendChild(tick);
	}
}

function setupTicker(ticker: HTMLOListElement): void {
	for (let text of TICKER_TEXT) {
		let item = document.createElement("li");
		item.textContent = text;
		item.classList.add("item");
		ticker.appendChild(item);
	}
	// pass
}

async function main(): Promise<void> {
	let fontsLoaded = loadFonts();

	let tt = document.querySelector<HTMLOListElement>(".terror-tracker");
	if (tt != null) {
		setupTerror(tt);
	} else {
		console.error("no terror tracker??");
	}

	let ticker = document.querySelector<HTMLOListElement>(".news-ticker");
	if (ticker != null) {
		setupTicker(ticker);
	} else {
		console.error("no ticker??");
	}
}
main();
