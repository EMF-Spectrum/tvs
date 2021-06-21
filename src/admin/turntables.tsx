import { callAPI } from "@/admin/api";
import "@/admin/turntables.scss";
import {
	AdminGameData,
	CurrentPhase,
	CurrentTurn,
	GameDataDispatch
} from "@/admin/useGameData";
import { PhaseConfig, SavedGame, TurnConfig } from "@/types/data";
import classNames from "classnames";
import moment from "moment";
import React, { useRef, useState } from "react";

function Icon({ name }: { name: string }) {
	return (
		<span className={`glyphicon glyphicon-${name}`} aria-hidden="true" />
	);
}

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

		try {
			let res = await callAPI("editPhase", {
				phaseID: phase.id,
				phaseConfig,
			});
			dispatch({ type: "phaseEdit", payload: res });
			stopEditing();
		} catch (e) {
			setSaving(false);
		}
	}

	const formID = "edit-" + phase.id;

	return (
		<tr
			className={classNames("game-phase", "-editing", {
				danger: isCurrent,
				warning: !isCurrent,
			})}
		>
			<th scope="row" className="name">
				<input
					className="form-control"
					disabled={isSaving}
					form={formID}
					defaultValue={phase.label}
					ref={labelRef}
				/>
			</th>
			<td className="length">
				<input
					className="form-control"
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
			<td className="controls">
				<form id={formID} onSubmit={onSubmit}>
					<button
						className="btn btn-primary"
						disabled={isSaving}
						type="submit"
					>
						{"Save"}
					</button>
					<button
						className="btn btn-link"
						disabled={isSaving}
						type="button"
						onClick={stopEditing}
					>
						{"Cancel"}
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
	const { isCurrent, phase, dispatch } = props;

	return (
		<tr
			className={classNames("game-phase", {
				success: isCurrent,
			})}
		>
			<th scope="row" className="name">
				{phase.label}
			</th>
			<td className="length">
				{phase.length != null
					? moment
							.duration(phase.length || Infinity, "milliseconds")
							.asMinutes() + " Minutes"
					: "-"}
			</td>
			<td className="controls">
				<div className="btn-group btn-group-justified">
					<div className="btn-group">
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => setEdit(true)}
							title="Edit"
						>
							<Icon name="edit" />
						</button>
					</div>
					<div className="btn-group">
						<button
							type="button"
							className="btn btn-danger"
							onClick={() => {
								callAPI("setPhase", {
									phaseID: phase.id,
								});
							}}
							title={isCurrent ? "Restart" : "Jump here"}
						>
							<Icon
								name={isCurrent ? "refresh" : "play-circle"}
							/>
						</button>
					</div>
					<div className="btn-group">
						<button
							type="button"
							className="btn btn-default"
							onClick={async () => {
								let res = await callAPI("bumpPhase", {
									phaseID: phase.id,
									direction: "up",
								});
								dispatch({ type: "turnEdit", payload: res });
							}}
							title="Move up"
						>
							<Icon name="chevron-up" />
						</button>
					</div>
					<div className="btn-group">
						<button
							type="button"
							className="btn btn-default"
							onClick={async () => {
								let res = await callAPI("bumpPhase", {
									phaseID: phase.id,
									direction: "down",
								});
								dispatch({ type: "turnEdit", payload: res });
							}}
							title="Move down"
						>
							<Icon name="chevron-down" />
						</button>
					</div>
				</div>
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
		<tbody className="game-turn">
			<tr className="info heading">
				<th scope="rowgroup" colSpan={2} className="name">
					{"Turn "}
					{turn.label}
				</th>
				<td className="control">
					<button
						className="btn btn-default btn-block btn-xs"
						type="button"
						onClick={async () => {
							let label = prompt("Name?");
							if (!label) {
								return;
							}
							let res = await callAPI("newPhase", {
								turnID: turn.id,
								phaseConfig: { label, length: null },
							});
							dispatch({ type: "phaseEdit", payload: res.phase });
							dispatch({ type: "turnEdit", payload: res.turn });
						}}
					>
						{"Add Phase"}
					</button>
				</td>
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
		<>
			<table className="table table-striped">
				<colgroup>
					<col width="40%"></col>
					<col width="40%"></col>
					<col width="15%"></col>
				</colgroup>
				{turnOrder.map((tid) => (
					<Turn
						key={tid}
						turn={turns[tid]}
						{...{ currentPhase, dispatch, phases }}
					/>
				))}
			</table>
			<div style={{ marginBottom: "2em" }}>
				<button
					type="button"
					className="btn btn-default btn-lg btn-block"
					onClick={async () => {
						await callAPI("newTurn");
						// least effort method of adding the new turn
						let res = await callAPI("getSaveGame");
						dispatch({ type: "data", payload: res });
					}}
				>
					{"Add Turn"}
				</button>
			</div>
		</>
	);
}
