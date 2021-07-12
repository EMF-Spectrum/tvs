import { BaseHTMLItem } from "@/display/base";
import "./ticker.scss";

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

export class Ticker extends BaseHTMLItem<undefined, HTMLOListElement> {
	constructor(el: HTMLOListElement) {
		super(el, undefined);

		el.innerHTML = "";

		for (let txt of TICKER_TEXT) {
			let li = document.createElement("li");
			li.textContent = txt;
			li.classList.add("item");
			el.appendChild(li);
		}
	}

	getState() {
		return undefined;
	}
	heartbeat() {
		// pass
	}
}
