import moment from "moment";
import React, { useState, useEffect } from "react";
import { callAPI } from "./api";
import { TimerStatus } from "../types/data";
import { CurrentTurn, CurrentPhase } from "./useGameData";
import { time } from "core-decorators";

function getTimerStr(duration: number) {
	let d = moment.duration(duration);
	let mins = d
		.minutes()
		.toString()
		.padStart(2, "0");
	let secs = d
		.seconds()
		.toString()
		.padStart(2, "0");

	return mins + ":" + secs;
}

function Timer({ timer }: { timer: TimerStatus }) {
	let [display, setDisplay] = useState("No Timer");
	useEffect(() => {
		if (timer.state == "hidden") {
			setDisplay("-");
			return;
		} else if (timer.state == "paused") {
			setDisplay(getTimerStr(timer.timeLeft));
			return;
		}
		function updoot() {
			if (timer.state != "running") return;
			setDisplay(getTimerStr(timer.endTime - Date.now()));
		}
		updoot();
		let handle = setInterval(updoot, 1000);
		return () => clearInterval(handle);
	}, [timer]);

	return <>{display}</>;
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
					flexGrow: 1,
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
					flexBasis: "4.3em",
					textAlign: "center",
					fontFamily: "Roboto Mono",
				}}
			>
				<Timer timer={timer} />
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
					style={{ width: "10em" }}
				>
					{!currentTurn ? "Start Game" : "Next"}
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
					style={{ width: "10em" }}
				>
					{timer.state == "paused" ? "Resume" : "Pause"}
				</button>
			)}
		</div>
	);
}
