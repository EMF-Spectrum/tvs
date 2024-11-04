// Quickfix - this type used to exist and now apparently doesn't.
export type DOMTimeStamp = number;

/*
 * Heartbeat types
 */
export interface TimerRunningStatus {
	state: "running";
	endTime: DOMTimeStamp;
}

export interface TimerPausedStatus {
	state: "paused";
	timeLeft: DOMTimeStamp;
}

export interface TimerHiddenStatus {
	state: "hidden";
}

export type TimerStatus =
	| TimerRunningStatus
	| TimerPausedStatus
	| TimerHiddenStatus;

export interface HeartbeatEvent {
	turn: number;
	phase: string;
	timer: TimerStatus;
	terror: number;
}

/*
 * Phase Updates
 */

export interface PhaseUpdateEvent {
	turn: string;
	phase: string;
	label: string;
}

/*
 * Raw game info
 */

export interface PhaseConfig {
	id: string;
	label: string;
	length: number | null;
}

export interface CurrentPhaseData extends PhaseConfig {
	started: DOMTimeStamp;
	ends: DOMTimeStamp;
}

export interface TurnConfig {
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
	currentPhase: CurrentPhaseData | null;
	currentTurn: string | null;
	paused: { timeLeft: DOMTimeStamp } | false;
	terror: number;
	over: boolean;
}
