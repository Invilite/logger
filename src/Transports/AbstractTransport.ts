import EventEmitter from "events";
import {LogLevel} from "../Logger";

export interface TransportArguments {
    levelName: string;
    content: any[];
    time: Date;
    timeString: string;
    requestId: string | undefined;
    processName: string | undefined;
}

export abstract class AbstractTransport extends EventEmitter {
    protected supportColors: boolean;
    protected readonly logLevel: LogLevel;

    public static getLevelFromName(levelName?: string, defaultLevel: LogLevel = LogLevel.debug): LogLevel {
        if (!levelName) {
            return defaultLevel;
        }

        // Try straight match
        for (const key of Object.values(LogLevel)) {
            if (typeof key !== 'string') continue;

            if (LogLevel[<any>key] == levelName) {
                return <LogLevel><any>LogLevel[<any>key];
            }
        }

        // Try match from string begin
        for (const key of Object.values(LogLevel)) {
            if (typeof key !== 'string') continue;

            if (key.startsWith(levelName)) {
                return <LogLevel><any>LogLevel[<any>key];
            }
        }

        return defaultLevel;
    }

    protected constructor(logLevel: LogLevel | string = LogLevel.info) {
        super();

        this.logLevel = (typeof logLevel === 'string') ? AbstractTransport.getLevelFromName(logLevel) : logLevel;
        this.supportColors = false;
    }

    public abstract write(level: LogLevel, args: TransportArguments, message: string): boolean;

    public getLogLevel(): LogLevel {
        return this.logLevel;
    }

    public getLogLevelName(): string {
        return LogLevel[this.logLevel];
    }

    public isSupportColors(): boolean {
        return this.supportColors;
    }
}