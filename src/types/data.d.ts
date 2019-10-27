// super imaginative name 🙄
export interface GamePhase {
	id: string;
	label: string;
}

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

export interface PhaseUpdateEvent {
	turn: string;
	phase: string;
	label: string;
}
