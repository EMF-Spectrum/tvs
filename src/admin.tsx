import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { HUD } from "./admin/hud";
import { HeartbeatEvent } from "./types/data";
import { TerrorController } from "./admin/terror";
import { callAPI } from "./admin/api";
import { SavedGame, TurnTables } from "./admin/turntables";

function AdminPage() {
	let [hb, setHB] = useState<HeartbeatEvent | null>(null);
	let [gameOver, setGameOver] = useState(false);
	let gameState = useRef<SavedGame>();

	useEffect(() => {
		let sockURL = new URL("/socket", window.location.href);
		sockURL.protocol = "ws";
		let sock = new WebSocket(sockURL.href);
		sock.addEventListener("message", (ev) => {
			let { type, data } = JSON.parse(ev.data);
			if (type == "heartbeat") {
				setHB(data);
			} else if (type == "gameOver") {
				setGameOver(true);
			} else if (type == "phaseChange" && gameState.current) {
				gameState.current.currentPhase = data;
			}
		});

		callAPI("getSaveGame").then((data) => {
			gameState.current = data;
		});
	}, []);

	if (!hb || !gameState.current) {
		return <h1>Loading!</h1>;
	} else if (gameOver) {
		return <h1>Game's over everyone, time to go home!</h1>;
	}

	let game = gameState.current;

	return (
		<>
			<HUD hb={hb} />
			<TerrorController hb={hb} />
			<h1>{"Hi!"}</h1>
			<TurnTables gameState={gameState} />
			<pre>{JSON.stringify(gameState.current, null, 2)}</pre>
		</>
	);
}

ReactDOM.render(
	<div className="container">
		<AdminPage />
	</div>,
	document.getElementById("root"),
);
