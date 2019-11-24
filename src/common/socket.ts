import { EventEmitter } from "events";
import StrictEventEmitter from "strict-event-emitter-types";
import { HeartbeatEvent } from "../types/data";
import { autobind } from "core-decorators";
import { SavedGame } from "../admin/turntables";

interface Events {
	heartbeat: HeartbeatEvent;
	phaseChange: SavedGame["currentPhase"];
	gameOver: void;
	disconnected: void;
	connected: void;
}

type MyEmitter = StrictEventEmitter<EventEmitter, Events>;

function asyncSleep(time: number): Promise<void> {
	return new Promise((r) => window.setTimeout(r, time));
}

const TIMEOUT = 100;

export class Socket extends (EventEmitter as { new (): MyEmitter }) {
	private socket?: WebSocket;

	constructor(private sockURL: string) {
		/* eslint-disable constructor-super */
		super();
	}

	@autobind
	private onMessage(event: MessageEvent): void {
		try {
			let { type, data } = JSON.parse(event.data);
			if (type) {
				this.emit(type, data);
			}

			console.debug("Message: %s %O", type, data);
		} catch (e) {
			console.error(
				"Got invalid data %o from the server!",
				event.data,
				e,
			);
		}
	}

	private async actualConnect(): Promise<void> {
		console.info("Connecting...");
		let sock = new WebSocket(this.sockURL);
		this.socket = sock;

		await new Promise((resolve, reject) => {
			function onError(): void {
				reject(new Error("Failed to connect!"));
			}
			sock.addEventListener("error", onError);
			sock.addEventListener("open", () => {
				sock.removeEventListener("error", onError);
				this.emit("connected");
				resolve(sock);
			});
		});
		console.info("Connected!");
		this.connectionPromise = undefined;

		sock.addEventListener("message", this.onMessage);
		sock.addEventListener("close", (ev) => {
			if (!ev.wasClean) {
				console.warn("Socket closed, retrying");
				this.connectionPromise = this.infiniteRetry();
			}
		});
	}

	private async infiniteRetry(): Promise<void> {
		while (!this.socket || this.socket.readyState != WebSocket.OPEN) {
			await asyncSleep(TIMEOUT);
			try {
				await this.actualConnect();
			} catch (e) {
				console.error("Failed to connect", e);
			}
		}
	}

	private connectionPromise?: Promise<void>;

	public connect(): Promise<void> {
		if (this.connectionPromise) {
			return this.connectionPromise;
		} else if (this.socket && this.socket.readyState == WebSocket.OPEN) {
			return Promise.resolve();
		}

		this.connectionPromise = this.actualConnect();

		return this.connectionPromise;
	}
}
