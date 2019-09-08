let canvas = document.getElementById("root") as HTMLCanvasElement;
if (!canvas) {
	throw new Error("gimme me my canvas");
}
let ctx = canvas.getContext("2d");
if (!ctx) {
	throw new Error("??");
}
ctx.font = "200px 'comic sans ms'";
ctx.fillText("hewwo", 500, 600);
