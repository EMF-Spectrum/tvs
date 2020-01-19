import React from "react";
import { PhaseConfig, SavedGame, TurnConfig } from "../types/data";
import { callAPI } from "./api";
import { CurrentPhase, AdminGameData, CurrentTurn } from "./useGameData";

interface TurnPhaseProps {
	phase: PhaseConfig;
	currentPhase: CurrentPhase;
}

function TurnPhase({ currentPhase, phase }: TurnPhaseProps) {
	function onClick(): void {
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
				callAPI("editPhase", {
					phaseID: phase.id,
					phaseConfig: data,
				});
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
	turn: TurnConfig;
	phases: SavedGame["phases"];
	currentPhase: CurrentPhase;
}
function Turn({ turn, currentPhase, phases }: TurnProps) {
	return (
		<tr>
			<th role="rowheading">{turn.label}</th>
			<td>
				<table className="table table-striped">
					<tbody>
						{turn.phases.map((pid) => (
							<TurnPhase
								key={pid}
								currentPhase={currentPhase}
								phase={phases[pid]}
							/>
						))}
					</tbody>
				</table>
			</td>
		</tr>
	);
}

interface TTProps {
	turns: AdminGameData["turns"];
	phases: AdminGameData["phases"];
	currentPhase: CurrentPhase;
	currentTurn: CurrentTurn;
	turnOrder: AdminGameData["turnOrder"];
}

export function TurnTables({
	phases,
	turns,
	currentPhase,
	turnOrder,
}: TTProps) {
	return (
		<table className="table">
			<tbody>
				{turnOrder.map((tid) => (
					<Turn
						key={tid}
						turn={turns[tid]}
						{...{ phases, currentPhase }}
					/>
				))}
			</tbody>
		</table>
	);
}
