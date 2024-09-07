import {LogLevel} from "../";

export interface TransportArguments {
    levelName: string;
    content: any[];
    time: Date;
    timeString: string;
    requestId: string | undefined;
    processName: string | undefined;
}

export abstract class AbstractTransport {
    protected supportColors: boolean;
    protected readonly logLevel: LogLevel;

    public static getLevelFromName(levelName?: string, defaultLevel: LogLevel = LogLevel.debug): LogLevel {
        if (!levelName) {
            return defaultLevel;
        }

        // Try straight match
        for (const key of Object.keys(LogLevel)) {
            if (typeof LogLevel[key as keyof typeof LogLevel] === 'number') {
                if (key === levelName) {
                    return LogLevel[key as keyof typeof LogLevel];
                }
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

    public abstract write(level: LogLevel, args: TransportArguments): boolean;

    protected constructor(logLevel: LogLevel | string = LogLevel.info) {
        this.logLevel = (typeof logLevel === 'string') ? AbstractTransport.getLevelFromName(logLevel) : logLevel;
        this.supportColors = false;
    }

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