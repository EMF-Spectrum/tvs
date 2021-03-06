import { BaseCanvasItem } from "./base";
import { WIDTH } from "./constants";
import { fontify } from "./fonts";

export class Ticker extends BaseCanvasItem {
	render(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, WIDTH, 100);

		ctx.fillStyle = "white";
		ctx.textAlign = "left";
		ctx.textBaseline = "bottom";
		ctx.font = "400 75px Roboto Mono "; // fontify("75px", 400);

		ctx.fillText(
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id lacus purus. Nulla sollicitudin eu libero id tincidunt. Quisque at imperdiet nisl. Maecenas dapibus sagittis tellus in vehicula. Nunc vehicula magna at eros consequat, in dapibus sem lacinia. Aliquam ut nibh turpis. Vivamus vitae dignissim enim, vulputate rutrum libero. Ut eu quam nec mi porttitor venenatis vitae at augue. Sed vehicula in purus vitae aliquam. Sed quis pretium nibh. Nulla facilisi.",
			-100,
			90,
		);
	}
}
