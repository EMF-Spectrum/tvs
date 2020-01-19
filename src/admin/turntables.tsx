import React from "react";
import { PhaseConfig, SavedGame, TurnConfig } from "../types/data";
import { callAPI } from "./api";
import {
	AdminGameData,
	CurrentPhase,
	CurrentTurn,
	GameDataDispatch,
} from "./useGameData";

interface TurnPhaseProps {
	currentPhase: CurrentPhase;
	dispatch: GameDataDispatch;
	phase: PhaseConfig;
}

function TurnPhase({ currentPhase, dispatch, phase }: TurnPhaseProps) {
	async function onClick() {
		let rawData = prompt(
			"RAW JSON?",
			JSON.stringify({
				label: phase.label,
				length:
					phase.length != null ? phase.length / (60 * 1000) : "null",
			}),
		);
		if (rawData) {
			try {
				let data = JSON.parse(rawData);
				let res = await callAPI("editPhase", {
					phaseID: phase.id,
					phaseConfig: data,
				});
				dispatch({ type: "phaseEdit", payload: res });
			} catch (e) {
				alert(e);
			}
		}
	}

	return (
		<tr
			key={phase.id}
			className={
				currentPhase && phase.id == currentPhase.id ? "danger" : ""
			}
		>
			<td>{phase.label}</td>
			<td>
				<button
					type="button"
					className="btn btn-danger"
					onClick={onClick}
				>
					{"edit"}
				</button>
			</td>
		</tr>
	);
}

interface TurnProps {
	currentPhase: CurrentPhase;
	dispatch: GameDataDispatch;
	phases: SavedGame["phases"];
	turn: TurnConfig;
}
function Turn({ currentPhase, dispatch, phases, turn }: TurnProps) {
	return (
		<tr>
			<th role="rowheading">{turn.label}</th>
			<td>
				<table className="table table-striped">
					<tbody>
						{turn.phases.map((pid) => (
							<TurnPhase
								key={pid}
								phase={phases[pid]}
								{...{ currentPhase, dispatch }}
							/>
						))}
					</tbody>
				</table>
			</td>
		</tr>
	);
}

interface TTProps {
	currentPhase: CurrentPhase;
	currentTurn: CurrentTurn;
	dispatch: GameDataDispatch;
	phases: AdminGameData["phases"];
	turnOrder: AdminGameData["turnOrder"];
	turns: AdminGameData["turns"];
}

export function TurnTables({
	currentPhase,
	dispatch,
	phases,
	turnOrder,
	turns,
}: TTProps) {
	return (
		<table className="table">
			<tbody>
				{turnOrder.map((tid) => (
					<Turn
						key={tid}
						turn={turns[tid]}
						{...{ currentPhase, dispatch, phases }}
					/>
				))}
			</tbody>
		</table>
	);
}
