import { useEffect, useReducer } from "react";
import { Socket, SocketEvents } from "../common/socket";
import { PhaseConfig, SavedGame, TimerStatus, TurnConfig } from "../types/data";
import { callAPI } from "./api";

export type CurrentTurn = TurnConfig | null;
export type CurrentPhase = PhaseConfig | null;

interface Action<T extends string, P> {
	type: T;
	payload: P;
}

const SOCKET_ACTIONS = [
	"heartbeat",
	"phaseChange",
	"turnChange",
	"gameOver",
] as const;

// type SocketAction<T extends keyof SocketEvents> = Action<T, SocketEvents[T]>;
type SocketAction<T extends typeof SOCKET_ACTIONS[number]> = Action<
	T,
	SocketEvents[T]
>;

type Actions =
	| SocketAction<"heartbeat">
	| SocketAction<"phaseChange">
	| SocketAction<"turnChange">
	| SocketAction<"gameOver">
	| Action<"data", SavedGame>;

export interface AdminGameData extends Omit<SavedGame, "paused"> {
	timer: TimerStatus;
}

function savedGameReducer(
	state: AdminGameData | null,
	action: Actions,
): AdminGameData | null {
	if (action.type == "data") {
		return {
			...action.payload,
			timer: state ? state.timer : { state: "hidden" },
		};
	} else if (!state) {
		return state;
	}

	switch (action.type) {
		case "gameOver":
			return { ...state, over: true };
		case "heartbeat": {
			/* eslint-disable @typescript-eslint/no-explicit-any */
			let { terror, timer } = action.payload;
			// Prevent useless re-renders
			if (
				state.terror == terror &&
				state.timer.state == timer.state &&
				// typescript is angry but this is valid
				(state.timer as any)["endTime"] == (timer as any)["endTime"] &&
				(state.timer as any)["timeLeft"] == (timer as any)["timeLeft"]
			) {
				return state;
			}

			return {
				...state,
				terror: action.payload.terror,
				timer: action.payload.timer,
			};
		}
		case "phaseChange":
			return { ...state, currentPhase: action.payload };
		case "turnChange":
			return { ...state, currentTurn: action.payload };
		default:
			throw new Error(`Unknown action ${action["type"]}?`);
	}
}

export function useGameData() {
	const [currentGame, dispatch] = useReducer(savedGameReducer, null);

	useEffect(() => {
		let sockURL = new URL("/socket", window.location.href);
		sockURL.protocol = "ws";
		let sock = new Socket(sockURL.href);
		for (let type of SOCKET_ACTIONS) {
			sock.on(type, (payload) => dispatch({ type, payload } as any));
		}
		sock.connect();

		callAPI("getSaveGame").then((data) =>
			dispatch({ type: "data", payload: data }),
		);
	}, []);

	return currentGame;
}
