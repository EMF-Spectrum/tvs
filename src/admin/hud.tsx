import { callAPI } from "@/admin/api";
import "@/admin/hud.scss";
import { CurrentPhase, CurrentTurn } from "@/admin/useGameData";
import { TimerStatus } from "@/types/data";
import classNames from "classnames";
import moment from "moment";
import React, { useEffect, useState } from "react";

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
		<div className="admin-hud">
			<div className="turn turn-display">
				<span className="text">{"Turn"}</span>
				<span className="turn">{currentTurn && currentTurn.label}</span>
			</div>
			<div className="phase">
				{currentPhase ? currentPhase.label : "Game Setup"}
			</div>
			<div
				className={classNames("timer", {
					"-paused": timer.state == "paused",
				})}
			>
				<Timer timer={timer} />
			</div>
			{showNextTurn ? (
				<button
					type="button"
					className="btn btn-success btn-lg control"
					onClick={() => {
						if (!currentTurn) {
							callAPI("startGame");
						} else {
							callAPI("advancePhase");
						}
					}}
				>
					{!currentTurn ? "Start Game" : "Next"}
				</button>
			) : (
				<button
					type="button"
					className="btn btn-warning btn-lg control"
					onClick={() => {
						if (timer.state == "paused") {
							callAPI("unpause");
						} else {
							callAPI("pause");
						}
					}}
				>
					{timer.state == "paused" ? "Resume" : "Pause"}
				</button>
			)}
		</div>
	);
}
