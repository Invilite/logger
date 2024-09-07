import {createWriteStream, WriteStream} from "fs";
import {TransportArguments} from "./AbstractTransport";
import {Console} from "./Console";
import {LogFormat, LogLevel} from "../";

// TODO: Optimise this class for unit tests
export class File extends Console {
    protected writeStream: WriteStream | null;

    public constructor(logLevel: LogLevel, logFormat: LogFormat, protected readonly filePath: string) {
        super(logLevel, logFormat);

        this.writeStream = createWriteStream(filePath, {
            flags: 'a',
            encoding: 'utf-8' as BufferEncoding,
            mode: 0o660,
            autoClose: true,
            emitClose: true,
            highWaterMark: 64 * 1024, // 64KB
        });

        this.writeStream.on('error', (err) => {
            console.error('Failed to write to log file:', err);
            this.writeStream = null;
        });
    }

    public write(level: LogLevel, args: TransportArguments): boolean {
        if (this.logLevel < level || level == LogLevel.silent) {
            return false;
        }

        if (!this.writeStream) {
            return false;
        }

        const message: string = this.formatMessage(level, args);

        this.writeStream.write(message, (error?: Error | null): void => {
            if (error) {
                console.error(error);
            }
        });

        return true;
    }

    public closeFile(): void {
        if (!this.writeStream) {
            return;
        }

        this.writeStream.end();
        this.writeStream = null;
    }
}