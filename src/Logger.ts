import "@invilite/date";
import {LogLevel} from "./types/LogLevel";
import {LoggerOptions} from "./index";
import {AbstractTransport} from "./Transports";

export class Logger {

    public constructor(protected readonly options: LoggerOptions = {}, protected transports: AbstractTransport[] = []) {
        if (!options.timeFormat) {
            this.options.timeFormat = "YY-MM-DD HH:mm:ss";
        }
    }

    public log(level: LogLevel, content: any[]): void {
        const now: Date = new Date();
        for (const transport of this.transports) {
            transport.write(level, {
                levelName: LogLevel[level],
                content,
                time: now,
                timeString: now.format(this.options.timeFormat as string),
                requestId: this.options.requestId,
                processName: this.options.processName,
            });
        }
    }

    /**
     * @deprecated Use "trace" instead.
     */
    public verbose(...message: any[]): void {
        return this.log(LogLevel.trace, message);
    }

    public trace(...message: any[]): void {
        return this.log(LogLevel.trace, message);
    }

    public debug(...message: any[]): void {
        return this.log(LogLevel.debug, message);
    }

    public info(...message: any[]): void {
        return this.log(LogLevel.info, message);
    }

    public notice(...message: any[]): void {
        return this.log(LogLevel.notice, message);
    }

    public warning(...message: any[]): void {
        return this.log(LogLevel.warning, message);
    }

    public error(...message: any[]): void {
        return this.log(LogLevel.error, message);
    }

    public critical(...message: any[]): void {
        return this.log(LogLevel.critical, message);
    }

    public alert(...message: any[]): void {
        return this.log(LogLevel.alert, message);
    }

    public emergency(...message: any[]): void {
        return this.log(LogLevel.emergency, message);
    }

    public setTimeFormat(format: string): Logger {
        this.options.timeFormat = format;

        return this;
    }

    public getTimeFormat(): string {
        return this.options.timeFormat as string;
    }

    public clearTransports(): Logger {
        this.transports = [];

        return this;
    }

    public addTransport(transport: AbstractTransport): Logger {
        this.transports.push(transport);

        return this;
    }

    public setTransports(transports: AbstractTransport[]): Logger {
        this.clearTransports();
        for (const transport of transports) {
            this.addTransport(transport);
        }

        return this;
    }

    public removeTransport(transport: AbstractTransport): Logger {
        const transportIndex = this.transports.indexOf(transport);

        if (transportIndex !== -1) {
            this.transports.splice(transportIndex, 1);
        }

        return this;
    }

    public getTransports(): AbstractTransport[] {
        return this.transports;
    }

    public clone(loggerOptions?: LoggerOptions): this {
        const newInstance = new (this.constructor as any)(
            { ...this.options },
            [...this.transports]
        );

        Object.assign(newInstance, this);

        if (loggerOptions) {
            newInstance.options = {
                ...newInstance.options,
                ...loggerOptions
            };
        }

        return newInstance;
    }
}