const FONT = "Orbitron";
export type OrbitronWeight = 400 | 500 | 700 | 900;
const EXPECTED_WEIGHTS: OrbitronWeight[] = [400, 500, 700, 900];

// WebFont.load
export function fontify(size: string, weight: OrbitronWeight = 400): string {
	return `${weight} ${size} ${FONT}`;
}

export function loadFonts(): Promise<void> {
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
				families: [`${FONT}:${EXPECTED_WEIGHTS.join(",")}`],
			},
		});
	});
}
