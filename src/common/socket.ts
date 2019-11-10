import { EventEmitter } from "events";
import StrictEventEmitter from "strict-event-emitter-types";
import { HeartbeatEvent } from "../types/data";

interface Events {
	heartbeat: HeartbeatEvent;
	disconnected: void;
	connected: void;
}

type MyEmitter = StrictEventEmitter<EventEmitter, Events>;

export class Socket extends (EventEmitter as { new (): MyEmitter }) {
	private socket?: WebSocket;

	constructor(private sockURL: string) {
		super();
	}

	private connectionPromise?: Promise<void>;

	public connect(): Promise<void> {
		if (this.connectionPromise) {
			return this.connectionPromise;
		} else if (this.socket && this.socket.readyState == WebSocket.OPEN) {
			return Promise.resolve();
		}

		let sock = new WebSocket(this.sockURL);
		this.socket = sock;

		this.connectionPromise = new Promise((resolve, reject) => {
			sock.addEventListener("error", reject);
			sock.addEventListener("open", () => {
				sock.removeEventListener("error", reject);
				this.emit("connected");
				resolve();
			});
		});

		// TODO: Manage connection

		return this.connectionPromise;
	}
}
