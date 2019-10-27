import moment from "moment";
import React, { useState, useEffect } from "react";
import { HeartbeatEvent } from "../types/data";
import { callAPI } from "./api";

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
	hb: HeartbeatEvent;
}
export function HUD({ hb }: HUDProps) {
	let showNextTurn = hb.timer.state == "hidden";

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
					{hb.turn}
				</span>
			</div>
			<div
				style={{
					fontSize: "48px",
					padding: "0 30px",
					borderRight: "2px solid black",
				}}
			>
				{hb.phase || "Game Setup"}
			</div>
			<div
				style={{
					fontSize: "48px",
					padding: "0 30px",
					color: hb.timer.state == "paused" ? "red" : undefined,
					marginRight: "30px",
					borderRight: "2px solid black",
				}}
			>
				{hb.timer.state == "hidden"
					? "No Timer"
					: moment
							.duration(
								hb.timer.state == "paused"
									? hb.timer.timeLeft
									: hb.timer.endTime - Date.now(),
							)
							.humanize()}
			</div>
			{showNextTurn ? (
				<button
					type="button"
					className="btn btn-success btn-lg"
					onClick={() => {
						if (hb!.turn == 0) {
							callAPI("startGame");
						} else {
							callAPI("advancePhase");
						}
					}}
				>
					{hb.turn == 0 ? "Start Game" : "Next Turn"}
				</button>
			) : (
				<button
					type="button"
					className="btn btn-warning btn-lg"
					onClick={() => {
						if (hb.timer.state == "paused") {
							callAPI("unpause");
						} else {
							callAPI("pause");
						}
					}}
				>
					{hb.timer.state == "paused" ? "unpause" : "pause"}
				</button>
			)}
		</div>
	);
}
