import "@invilite/date";
import util from "util";
import chalk from "chalk";
import {AbstractTransport} from "./Transports/AbstractTransport";

export enum LogLevel {
    silent = -1,
    emergency = 0,
    alert,
    critical,
    error,
    warning,
    notice,
    info,
    debug,
    trace,
}

export enum LogFormat {
    FORMAT_COLOR,
    FORMAT_PLAIN,
    FORMAT_JSON
}

export interface LoggerOptions {
    requestId?: string;
    processName?: string;
    timeFormat?: string;
}

export class Logger {
    public static readonly colors = {
        /* trace */     8: chalk.italic.rgb(160, 160, 160),
        /* debug */     7: chalk.rgb(160, 160, 160),
        /* info */      6: chalk.rgb(80, 220, 38),
        /* notice */    5: chalk.rgb(68, 148, 240),
        /* warning */   4: chalk.rgb(220, 190, 48),
        /* error */     3: chalk.rgb(255, 60, 60),
        /* critical */  2: chalk.rgb(255, 60, 60),
        /* alert */     1: chalk.rgb(255, 60, 60),
        /* emergency */ 0: chalk.rgb(255, 60, 60),
        stackTrace: chalk.rgb(165, 66, 66),
        processName: chalk.rgb(160, 160, 160),
        time: chalk.rgb(200, 200, 200),
        true: chalk.underline.rgb(80, 210, 38),
        false: chalk.underline.rgb(255, 92, 60),
    };

    protected static convertToString(arg: any, level: LogLevel, enableColors = false): string {
        switch (typeof arg) {
        case "string":
            return (enableColors) ? Logger.colors[<LogLevel.trace>level](arg) : arg;

        case "symbol":
        case "bigint":
        case "object":
        case "number":
            if (((arg as Error).stack && (arg as Error).message)) {
                return (enableColors) ? Logger.colors.stackTrace((arg as Error).stack) : <string>(arg as Error).stack;
            }
            return util.inspect(arg, false, null, enableColors);

        case "boolean":
            if (enableColors) {
                return (arg) ? Logger.colors.true('true') : Logger.colors.false('false');
            }
            return (arg) ? 'true' : 'false';

        case "function":
            return util.inspect(arg, false, null, enableColors);

        case "undefined":
            return '';

        default:
            // As a fallback use native toString method
            return arg.toString();
        }
    }

    protected timeFormat = "YY-MM-DD HH:mm:ss";

    public constructor(protected readonly options: LoggerOptions = {}, protected transports: AbstractTransport[] = []) {
        if (options.timeFormat) {
            this.setTimeFormat(options.timeFormat);
        }
    }

    public clearTransports(): Logger {
        this.transports = [];
        // TODO: Remove error listeners

        return this;
    }

    public addTransport(transport: AbstractTransport): Logger {
        this.transports.push(transport);

        transport.on('error', (error: Error) => {
            this.critical('Logger error:', error);
        });

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

        // TODO: Remove error listener
        if (transportIndex !== -1) {
            delete this.transports[transportIndex];
        }

        return this;
    }

    public log(level: LogLevel, content: any[]): void {
        const now = new Date();
        for (const transport of this.transports) {
            const colors: boolean = transport.isSupportColors();
            const messages: string[] = [];
            let i = 0;
            while (i < content.length) {
                messages.push(Logger.convertToString(content[i++], level, colors));
            }
            transport.write(level, {
                levelName: colors ? Logger.colors[<LogLevel.debug>level](LogLevel[level]) : LogLevel[level],
                content,
                time: now,
                timeString: colors ? Logger.colors.time(now.format(this.timeFormat)) : now.format(this.timeFormat),
                requestId: this.options.requestId,
                processName: (colors && this.options.processName) ? Logger.colors.processName(this.options.processName) : this.options.processName,
            }, messages.join(' '));
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
        this.timeFormat = format;

        return this;
    }

    public getTimeFormat(): string {
        return this.timeFormat;
    }
}
