import {AbstractTransport, TransportArguments} from "./AbstractTransport";
import {LogLevel} from "../";

export enum LogFormat {
    FORMAT_COLOR,
    FORMAT_PLAIN,
    FORMAT_JSON
}

export class Console extends AbstractTransport {
    public constructor(logLevel: LogLevel, protected readonly logFormat: LogFormat = LogFormat.FORMAT_PLAIN) {
        super(logLevel);

        if (logFormat === LogFormat.FORMAT_COLOR) {
            this.supportColors = true;
        }
    }

    public write(level: LogLevel, args: TransportArguments, message: string): boolean {
        if (this.logLevel < level) {
            return false;
        }
        process.stdout.write(this.formatMessage(level, args, message));

        return true;
    }

    protected formatMessage(level: LogLevel, args: TransportArguments, message: string): string {
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

        let process = '';
        const spacePad = " ".repeat(10 - LogLevel[level].length);

        if (args.processName) {
            process = `(${args.processName}) `;
        }

        return(`${args.timeString} [${args.levelName}]${spacePad}${process}${message}\r\n`);
    }
}