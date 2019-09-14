import { WIDTH } from "@/display/constants";
import { fontify } from "@/display/fonts";

const DIGIT_SPACING = 0;
const COLON_VOFFSET = -20;
const TOTAL_VOFSET = 30; // Random number to fight with the baseline
const TEXT_SIZE = "250px";

/**
 * This could probably be done neater but whatever
 */
function timeBreakdown(num: DOMHighResTimeStamp): [number, number, number] {
	let ms = num % 1000;
	let temp = Math.floor(num / 1000);
	let s = temp % 60;
	let m = Math.floor(temp / 60);
	return [m, s, ms];
}

function digit(num: number, which: number): string {
	return (Math.floor(num / 10 ** which) % 10).toFixed(0);
}

export function Clock(
	ctx: CanvasRenderingContext2D,
	display: DOMHighResTimeStamp,
): void {
	ctx.font = fontify(TEXT_SIZE);
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	const { width: digitWidth } = ctx.measureText("0");
	const { width: colonWidth } = ctx.measureText(":");

	const digitPad = digitWidth + DIGIT_SPACING;
	const colonPad = colonWidth / 2 + digitWidth / 2 + DIGIT_SPACING;

	const totalWidth = digitWidth * 6 + colonWidth * 2 + DIGIT_SPACING * 5;
	const hoffset = (WIDTH - totalWidth + digitWidth) / 2;

	ctx.strokeStyle = "red";
	ctx.strokeRect(hoffset - digitWidth / 2, -100, totalWidth, 200);
	ctx.translate(hoffset, TOTAL_VOFSET);

	let [m, s, ms] = timeBreakdown(display);
	let x = 0;
	ctx.fillText(digit(m, 1), x, 0);
	x += digitPad;
	ctx.fillText(digit(m, 0), x, 0);
	x += colonPad;
	ctx.fillText(":", x, COLON_VOFFSET);
	x += colonPad;
	ctx.fillText(digit(s, 1), x, 0);
	x += digitPad;
	ctx.fillText(digit(s, 0), x, 0);
	x += colonPad;
	ctx.fillText(":", x, COLON_VOFFSET);
	x += colonPad;
	ctx.fillText(digit(ms, 2), x, 0);
	x += digitPad;
	ctx.fillText(digit(ms, 1), x, 0);
}