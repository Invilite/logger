import * as fs from "fs";
import {WriteFileOptions} from "fs";
import {TransportArguments} from "./AbstractTransport";
import {LogLevel} from "../";
import ErrnoException = NodeJS.ErrnoException;
import {Console, LogFormat} from "./Console";

export class File extends Console {
    protected readonly writeOptions: WriteFileOptions;

    public constructor(logLevel: LogLevel, logFormat: LogFormat, protected readonly filePath: string) {
        super(logLevel, logFormat);

        this.writeOptions = {
            mode: 0o666,
            encoding: "utf-8",
            flag: "a+"
        };
    }

    public write(level: LogLevel, args: TransportArguments, message: string): boolean {
        if (this.logLevel < level) {
            return false;
        }
        fs.writeFile(this.filePath, this.formatMessage(level, args, message), this.writeOptions, (error: ErrnoException | null) => {
            if (error) {
                this.emit('error', error);
            }
            // file written successfully
        });

        return true;
    }
}