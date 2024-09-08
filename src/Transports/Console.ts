import {AbstractTransport, TransportArguments} from "./AbstractTransport";
import {LogFormat, LogLevel} from "../";
import chalk from "chalk";
import util from "util";

export class Console extends AbstractTransport {
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

    public constructor(logLevel: LogLevel, protected readonly logFormat: LogFormat = LogFormat.FORMAT_PLAIN) {
        super(logLevel);

        if (logFormat === LogFormat.FORMAT_COLOR) {
            this.supportColors = true;
        }
    }

    public write(level: LogLevel, args: TransportArguments): boolean {
        if (this.logLevel < level || level == LogLevel.silent) {
            return false;
        }

        process.stdout.write(this.formatMessage(level, args));

        return true;
    }

    protected formatMessage(level: LogLevel, args: TransportArguments): string {
        if (this.supportColors) {
            args.levelName = Console.colors[<LogLevel.debug>level](args.levelName);
            args.timeString = Console.colors.time(args.timeString);
            args.processName = args.processName ? Console.colors.processName(args.processName) : undefined;
        }

        const messages: string[] = args.content.map(message => {
            if (typeof message === "string") {
                return this.supportColors ? Console.colors[<LogLevel.trace>level](message) : message;
            } else if (message instanceof Error && message.stack) {
                return this.supportColors ? Console.colors.stackTrace(message.stack) : message.stack;
            } else if (typeof message === "boolean") {
                if (this.supportColors) {
                    return (message) ? Console.colors.true('true') : Console.colors.false('false');
                }
                return (message) ? 'true' : 'false';
            } else {
                return util.inspect(message, false, null, this.supportColors);
            }
        });

        const message: string = messages.join(' ');

        if (this.logFormat === LogFormat.FORMAT_JSON) {
            return(JSON.stringify({
                time: args.time,
                level: args.levelName,
                message,
                requestId: args.requestId,
                processName: args.processName,
                args: args.content,
            }, (key: string, value: any) => typeof value === 'bigint' ? value.toString() : value ) + "\r\n");
        }

        let process: string = '';
        let requestId: string = '';
        const spacePad: string = " ".repeat(10 - LogLevel[level].length);

        if (args.processName) {
            process = `[${args.processName}] `;
        }

        if (args.requestId) {
            requestId = `(${args.requestId}) `;
        }

        return(`${args.timeString} [${args.levelName}]${spacePad}${process}${requestId}${message}\r\n`);
    }
}