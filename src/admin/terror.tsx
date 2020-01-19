import React from "react";
import { HeartbeatEvent } from "../types/data";
import { callAPI } from "./api";

interface TerrorProps {
	hb: HeartbeatEvent;
}
export function TerrorController({ hb }: TerrorProps) {
	if (hb.turn == 0) {
		return null;
	}

	return (
		<p style={{ marginTop: "1em" }}>
			<button
				type="button"
				disabled={hb.terror == 1}
				className="btn btn-default btn-lg"
				onClick={() => callAPI("addTerror", { amount: -1 })}
			>
				{"-"}
			</button>{" "}
			<button type="button" disabled className="btn btn-default btn-lg">
				{"Terror Tracker: "}
				{hb.terror}
			</button>{" "}
			<button
				type="button"
				className="btn btn-default btn-lg"
				onClick={() => callAPI("addTerror", { amount: 1 })}
			>
				{"+"}
			</button>
			<span
				style={{
					display: "inline-block",
					margin: "0 2em",
				}}
			>
				{" | "}
			</span>
			<button
				type="button"
				className="btn btn-default btn-lg"
				onClick={() => {
					let amount = parseInt(prompt("How much terror?") || "");
					if (amount) {
						callAPI("addTerror", { amount });
					}
				}}
			>
				{"Add Terror"}
			</button>{" "}
			<button
				type="button"
				className="btn btn-default btn-lg"
				onClick={() => {
					let amount = parseInt(prompt("How much terror?") || "");
					if (amount) {
						callAPI("setTerror", { amount });
					}
				}}
			>
				{"Set Terror"}
			</button>{" "}
			<button
				type="button"
				className="btn btn-danger btn-lg"
				onClick={() => {
					let amount = Math.floor((250 - hb.terror) / 2);
					if (amount > 0) {
						callAPI("addTerror", { amount });
					}
				}}
			>
				{"Reveal Aliens"}
			</button>
		</p>
	);
}
