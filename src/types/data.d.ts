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

export interface APIPhase {
	id: string;
	label: string;
}
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

export interface CurrentPhase {
	id: string;
	started: DOMTimeStamp;
	ends: DOMTimeStamp;
	length: null | number;
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
	currentPhase: CurrentPhase | null;
	currentTurn: string | null;
	paused: { timeLeft: DOMTimeStamp } | false;
	terror: number;
	over: boolean;
}
