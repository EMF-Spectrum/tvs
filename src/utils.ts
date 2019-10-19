import { easeLinear } from "d3-ease";

export function lerp(
	start: number,
	end: number,
	amt: number,
	fn: (n: number) => number = easeLinear,
): number {
	amt = fn(amt);
	return (1 - amt) * start + amt * end;
}
