const PRIMARY_FONT = "Orbitron";
const SECONDARY_FONT = "Roboto Mono";
export type OrbitronWeight = 400 | 500 | 700 | 900;
export type RobotoWeight = 400;
const PRIMARY_WEIGHTS: OrbitronWeight[] = [400, 500, 700, 900];
const SECONDARY_WEIGHTS: RobotoWeight[] = [400];

// WebFont.load
export function fontify(
	size: string,
	weight: OrbitronWeight = 400,
	primary = true,
): string {
	let font: string;
	if (primary) {
		font = PRIMARY_FONT;
	} else {
		font = SECONDARY_FONT;
	}
	return `${weight} ${size} ${font}`;
}

function loadStix(): Promise<void> {
	return new Promise((resolve, reject): void => {
		window.WebFont.load({
			classes: false,
			active() {
				resolve();
			},
			inactive() {
				reject();
			},
			google: {
				families: ["STIX Two Math"],
				text: "⍭",
			},
		});
	});
}

export function loadFonts(): Promise<void> {
	return new Promise((resolve, reject): void => {
		window.WebFont.load({
			classes: false,
			active() {
				resolve(loadStix());
			},
			inactive() {
				reject();
			},
			google: {
				families: [
					PRIMARY_FONT + ":" + PRIMARY_WEIGHTS.join(","),
					SECONDARY_FONT + ":" + SECONDARY_WEIGHTS.join(","),
				],
			},
		});
	});
}
