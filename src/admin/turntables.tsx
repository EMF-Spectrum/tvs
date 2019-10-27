import React from "react";
import { callAPI } from "./api";

// Duplicated types because it's 2am
interface PhaseConfig {
	id: string;
	label: string;
	length: number;
}

interface CurrentPhase {
	id: string;
	started: DOMTimeStamp;
	ends: DOMTimeStamp;
	length: null | number;
}

interface TurnConfig {
	id: string;
	label: number;
	phases: string[];
}

export interface SavedGame {
	phases: {
		[id: string]: PhaseConfig;
	};
	turns: {
		[id: string]: TurnConfig;
	};
	turnOrder: string[];
	currentPhase: CurrentPhase | null;
	currentTurn: string | null;
	paused: { timeLeft: DOMTimeStamp } | false;
	terror: number;
	over: boolean;
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
						{turn.phases.map((pid) => {
							let phase = phases[pid];
							return (
								<tr
									key={pid}
									className={
										currentPhase &&
										phase.id == currentPhase.id
											? "danger"
											: ""
									}
								>
									<td>{phase.label}</td>
									<td>
										<button
											type="button"
											className="btn btn-danger"
											onClick={() => {
												let rawData = prompt(
													"RAW JSON?",
													`{label:"${
														phase.label
													}",length:${phase.length /
														(60 * 1000)}"}`,
												);
												if (rawData) {
													try {
														let data = JSON.parse(
															rawData,
														);
														callAPI("editPhase", {
															phaseID: phase.id,
															phaseConfig: data,
														});
													} catch (e) {
														alert(e);
													}
												}
											}}
										>
											edit
										</button>
									</td>
								</tr>
							);
						})}
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
