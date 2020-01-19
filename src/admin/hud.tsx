import moment from "moment";
import React, { useState, useEffect } from "react";
import { callAPI } from "./api";
import { TimerStatus } from "../types/data";
import { CurrentTurn, CurrentPhase } from "./useGameData";

function Moment({ duration }: { duration: number }) {
	let [durationTXT, setDuration] = useState("");
	useEffect(() => {
		function updoot() {
			setDuration(moment.duration(duration).humanize());
		}
		let handle = setInterval(updoot, 1000);
		return () => clearInterval(handle);
	}, []);

	return <>{durationTXT}</>;
}

interface HUDProps {
	timer: TimerStatus;
	currentTurn: CurrentTurn;
	currentPhase: CurrentPhase;
}
export function HUD({ timer, currentTurn, currentPhase }: HUDProps) {
	let showNextTurn = timer.state == "hidden";

	return (
		<div
			style={{
				display: "flex",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					textAlign: "center",
					padding: "0 30px",
					borderRight: "2px solid black",
				}}
			>
				<span style={{ fontSize: "20px" }}>{"Turn"}</span>
				<span style={{ fontSize: "30px", fontWeight: 700 }}>
					{currentTurn && currentTurn.label}
				</span>
			</div>
			<div
				style={{
					fontSize: "48px",
					padding: "0 30px",
					borderRight: "2px solid black",
				}}
			>
				{currentPhase ? currentPhase.label : "Game Setup"}
			</div>
			<div
				style={{
					fontSize: "48px",
					padding: "0 30px",
					color: timer.state == "paused" ? "red" : undefined,
					marginRight: "30px",
					borderRight: "2px solid black",
				}}
			>
				{timer.state == "hidden"
					? "No Timer"
					: moment
							.duration(
								timer.state == "paused"
									? timer.timeLeft
									: timer.endTime - Date.now(),
							)
							.humanize()}
			</div>
			{showNextTurn ? (
				<button
					type="button"
					className="btn btn-success btn-lg"
					onClick={() => {
						if (!currentTurn) {
							callAPI("startGame");
						} else {
							callAPI("advancePhase");
						}
					}}
				>
					{!currentTurn ? "Start Game" : "Next Turn"}
				</button>
			) : (
				<button
					type="button"
					className="btn btn-warning btn-lg"
					onClick={() => {
						if (timer.state == "paused") {
							callAPI("unpause");
						} else {
							callAPI("pause");
						}
					}}
				>
					{timer.state == "paused" ? "unpause" : "pause"}
				</button>
			)}
		</div>
	);
}
