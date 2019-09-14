const FONT = "Orbitron";
type OrbitronWeight = 400;
const EXPECTED_WEIGHTS: OrbitronWeight[] = [400];

// WebFont.load
export function fontify(size: string, weight: OrbitronWeight = 400): string {
	return `${weight} ${size} ${FONT}`;
}

export function loadFonts(): Promise<void> {
	return new Promise((resolve, reject): void => {
		let variants = EXPECTED_WEIGHTS.map(
			(weight) => `n${Math.floor(weight / 100)}`,
		).join(",");

		window.WebFont.load({
			classes: false,
			active() {
				resolve();
			},
			inactive() {
				reject();
			},
			google: {
				families: [`${FONT}:${variants}`],
			},
		});
	});
}
