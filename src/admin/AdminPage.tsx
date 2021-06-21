import { HUD } from "@/admin/hud";
import { TerrorController } from "@/admin/terror";
import { HUDTicker } from "@/admin/ticker";
import { TurnTables } from "@/admin/turntables";
import { CurrentPhase, CurrentTurn, useGameData } from "@/admin/useGameData";
import React from "react";

export function AdminPage() {
	const [game, dispatch] = useGameData();

	if (!game) {
		return <h1>{"Loading!"}</h1>;
	} else if (game.over) {
		return <h1>{"Game's over everyone, time to go home!"}</h1>;
	}

	let currentTurn: CurrentTurn = null;
	if (game.currentTurn) {
		currentTurn = game.turns[game.currentTurn];
	}

	let currentPhase: CurrentPhase = null;
	if (game.currentPhase) {
		currentPhase = game.phases[game.currentPhase.id];
	}

	let { timer, terror, turnOrder, turns, phases } = game;

	return (
		<>
			<HUD {...{ timer, currentPhase, currentTurn }} />
			<TerrorController {...{ terror, currentTurn }} />
			<HUDTicker />
			<TurnTables
				{...{
					currentPhase,
					currentTurn,
					dispatch,
					phases,
					turnOrder,
					turns,
				}}
			/>
		</>
	);
}
