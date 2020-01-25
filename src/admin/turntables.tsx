import moment from "moment";
import React, { useState, useRef } from "react";
import { PhaseConfig, SavedGame, TurnConfig } from "../types/data";
import { callAPI } from "./api";
import {
	AdminGameData,
	CurrentPhase,
	CurrentTurn,
	GameDataDispatch,
} from "./useGameData";

interface TurnPhaseProps {
	dispatch: GameDataDispatch;
	isCurrent: boolean;
	phase: PhaseConfig;
}

interface EditTurnProps extends TurnPhaseProps {
	stopEditing: () => void;
}

function EditableTurnPhase({
	dispatch,
	isCurrent,
	phase,
	stopEditing,
}: EditTurnProps) {
	const [isSaving, setSaving] = useState(false);
	const labelRef = useRef<HTMLInputElement>(null);
	const lengthRef = useRef<HTMLInputElement>(null);

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (
			!labelRef.current ||
			!lengthRef.current ||
			!labelRef.current.validity.valid ||
			!lengthRef.current.validity.valid
		) {
			return;
		}
		let label = labelRef.current.value;
		let length = lengthRef.current.valueAsNumber;
		length = moment.duration(length, "minutes").asMilliseconds();

		try {
			setSaving(true);
			let phaseConfig: PhaseConfig = {
				...phase,
				label,
				length,
			};
			// RIP anyone who wanted a 0 minute round
			if (phaseConfig.length == 0) {
				phaseConfig.length = null;
			}

			let res = await callAPI("editPhase", {
				phaseID: phase.id,
				phaseConfig,
			});
			dispatch({ type: "phaseEdit", payload: res });
			stopEditing();
		} catch (e) {
			alert(e);
		}
	}

	const formID = "edit-" + phase.id;

	return (
		<tr className={isCurrent ? "danger" : "warning"}>
			<th scope="row" style={{ textIndent: "2em", fontWeight: "normal" }}>
				<input
					disabled={isSaving}
					form={formID}
					defaultValue={phase.label}
					ref={labelRef}
				/>
			</th>
			<td>
				<input
					defaultValue={moment
						.duration(phase.length || 0, "milliseconds")
						.asMinutes()}
					disabled={isSaving}
					form={formID}
					min={0}
					step={0.01}
					ref={lengthRef}
					type="number"
				/>
			</td>
			<td>
				<form id={formID} onSubmit={onSubmit}>
					<button
						className="btn btn-primary"
						disabled={isSaving}
						type="submit"
						style={{ width: "5em" }}
					>
						{"Save"}
					</button>
				</form>
			</td>
		</tr>
	);
}

function TurnPhase(props: TurnPhaseProps) {
	const [isEdit, setEdit] = useState(false);
	if (isEdit) {
		return (
			<EditableTurnPhase {...props} stopEditing={() => setEdit(false)} />
		);
	}
	const { isCurrent, phase } = props;

	return (
		<tr className={isCurrent ? "success" : ""}>
			<th scope="row" style={{ textIndent: "2em", fontWeight: "normal" }}>
				{phase.label}
			</th>
			<td>
				{phase.length != null
					? moment
							.duration(phase.length || Infinity, "milliseconds")
							.asMinutes() + " Minutes"
					: "-"}
			</td>
			<td>
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => setEdit(true)}
					style={{ width: "5em" }}
				>
					{"Edit"}
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
		<tbody>
			<tr className="info">
				<th scope="rowgroup" colSpan={3}>
					{"Turn "}
					{turn.label}
				</th>
			</tr>
			{turn.phases.map((pid) => (
				<TurnPhase
					key={pid}
					dispatch={dispatch}
					isCurrent={currentPhase ? currentPhase.id == pid : false}
					phase={phases[pid]}
				/>
			))}
		</tbody>
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
		<table className="table table-striped">
			<thead>
				<tr>
					<th style={{ width: "50%" }}></th>
					<th style={{ width: "50%" }}></th>
					<th style={{ width: "1%" }}></th>
				</tr>
			</thead>
			{turnOrder.map((tid) => (
				<Turn
					key={tid}
					turn={turns[tid]}
					{...{ currentPhase, dispatch, phases }}
				/>
			))}
		</table>
	);
}
