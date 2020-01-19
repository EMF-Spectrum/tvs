import React from "react";
import { callAPI } from "./api";
import { TurnConfig, SavedGame, PhaseConfig } from "../types/data";

interface TurnPhaseProps {
	phase: PhaseConfig;
	currentPhase: SavedGame["currentPhase"];
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
	currentPhase: SavedGame["currentPhase"];
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
	gameState: React.MutableRefObject<SavedGame | undefined>;
}

export function TurnTables({ gameState }: TTProps) {
	if (!gameState.current) return null;
	let { turnOrder, phases, currentPhase, turns } = gameState.current;

	return (
		<table className="table">
			<tbody>
				{turnOrder.map((tid) => {
					let turn = turns[tid];
					return (
						<Turn key={tid} {...{ turn, phases, currentPhase }} />
					);
				})}
			</tbody>
		</table>
	);
}
