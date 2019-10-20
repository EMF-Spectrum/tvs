import _clone from "lodash/clone";
import { EventEmitter } from "events";
import { runInThisContext } from "vm";
import { minify } from "html-minifier";

const MINUTES = 60 * 1000;

interface PhaseConfig {
	name: string;
	length: number;
}

const DEFAULT_PHASES: PhaseConfig[] = [
	{
		name: "Team Phase",
		// length: 10,
		length: 0.1,
	},
	{
		name: "Action Phase",
		// length: 15,
		length: 0.15,
	},
	{
		name: "Diplomacy Phase",
		// length: 10,
		length: 0.1,
	},
	{
		name: "End of Turn",
		// length: 5,
		length: 0.05,
	},
];

interface CurrentPhase {
	name: string;
	ends: DOMHighResTimeStamp;
}

export class SpectrumServer extends EventEmitter {
	private maxTurns = 8;
	private currentTurn?: {
		num: number;
		currentPhase: CurrentPhase;
		upcomingPhases: PhaseConfig[];
	};

	constructor() {
		super();
		// TODO
	}

	private newPhase(
		now: DOMHighResTimeStamp,
		{ name, length }: PhaseConfig,
	): CurrentPhase {
		let ends = now + length * MINUTES;
		this.emit("setPhase", name);
		this.emit("setClockEnd", ends);
		return {
			name,
			ends,
		};
	}

	private newTurn(now: DOMHighResTimeStamp, num: number): void {
		let upcomingPhases = _clone(DEFAULT_PHASES);
		let currentPhase = this.newPhase(now, upcomingPhases.shift()!);
		this.currentTurn = {
			num,
			currentPhase,
			upcomingPhases,
		};
		this.emit("setTurn", num);
	}

	private setTerror(stage: number): void {
		this.emit("setTerror", stage);
	}

	start(now: DOMHighResTimeStamp): void {
		this.newTurn(now, 1);
		this.setTerror(1);
	}

	think(now: DOMHighResTimeStamp): void {
		if (!this.currentTurn) {
			return;
		}

		let { currentPhase, upcomingPhases, num } = this.currentTurn;

		if (currentPhase.ends < now) {
			let nextPhase = upcomingPhases.shift();
			if (nextPhase) {
				this.currentTurn.currentPhase = this.newPhase(now, nextPhase);
			} else {
				if (num >= this.maxTurns) {
					// TODO
					// alert("Congrats you reached the end of the internet");
					throw new Error("HONK");
				}
				this.newTurn(now, num + 1);
			}
		}
	}
}
