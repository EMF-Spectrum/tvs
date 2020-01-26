import React from "react";
import { callAPI } from "./api";
import { CurrentTurn } from "./useGameData";

interface TerrorProps {
	terror: number;
	currentTurn: CurrentTurn;
}

export function TerrorController({ terror, currentTurn }: TerrorProps) {
	return (
		<p style={{ marginTop: "1em" }}>
			<button
				type="button"
				disabled={!currentTurn || terror == 1}
				className="btn btn-default btn-lg"
				onClick={() => callAPI("addTerror", { amount: -1 })}
			>
				{"-"}
			</button>{" "}
			<button type="button" disabled className="btn btn-default btn-lg">
				{"Terror Tracker: "}
				{terror}
			</button>{" "}
			<button
				type="button"
				className="btn btn-default btn-lg"
				disabled={!currentTurn}
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
				disabled={!currentTurn}
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
				disabled={!currentTurn}
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
				disabled={!currentTurn}
				onClick={() => {
					let amount = Math.floor((250 - terror) / 2);
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
