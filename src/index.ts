import "@invilite/date";
export * from "./Logger";
export * from "./types/LogLevel";
export * from "./types/LogFormat";

export interface LoggerOptions {
    requestId?: string;
    processName?: string;
    timeFormat?: string;
}


