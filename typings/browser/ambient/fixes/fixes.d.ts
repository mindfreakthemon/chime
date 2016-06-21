interface HTMLElement {
	closest(selector: string): HTMLElement;
}


declare namespace chrome {
	let Event: { new <T extends Function>(): chrome.events.Event<T> };
}


declare namespace chrome.events {
	interface Event<T extends Function> {
		dispatch(arguments?: any): void;
	}
}

declare module 'md5' {
	export default function (value: string, key?: string, raw?: boolean): string;
}
