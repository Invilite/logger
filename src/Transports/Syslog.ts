import * as os from "os";
import util from "util";
import dgram from 'dgram';
import {LogLevel} from "../";
import {AbstractTransport, TransportArguments} from "./AbstractTransport";

// TODO: Optimise this class for unit tests
export class Syslog extends AbstractTransport {
    protected readonly socket: dgram.Socket;
    protected readonly hostname: string;

    public constructor(logLevel: LogLevel, protected readonly remoteHost: string, protected readonly remotePort: number = 514) {
        super(logLevel);
        this.socket = dgram.createSocket({
            type: 'udp4'
        });
        this.socket.on('error', (error: Error) => {
            console.error(error);
        });
        this.hostname = os.hostname();
    }

    public write(level: LogLevel, args: TransportArguments): boolean {
        if (this.logLevel < level || level == LogLevel.silent) {
            return false;
        }

        // In Syslog debug is a top level
        const logLevel: LogLevel = (level === LogLevel.trace) ? LogLevel.debug : level;
        const facility: number = 1; // user messages
        const syslogMessage: Buffer = this.formatMessage(logLevel, args, facility);

        this.socket.send(syslogMessage, this.remotePort, this.remoteHost, (error: Error | null) => {
            if (error) {
                console.error(error);
            }
        });

        return true;
    }

    protected formatMessage(level: LogLevel, args: TransportArguments, facility: number): Buffer {
        const messages: string[] = args.content.map(message => {
            if (typeof message === "string") {
                return message;
            } else if (message instanceof Error && message.stack) {
                return message.message;
            } else if (typeof message === "boolean") {
                return (message) ? 'true' : 'false';
            } else {
                return util.inspect(message, false, null, false);
            }
        });

        if (!args.processName) {
            args.processName = process.title;
        }

        const PRI: string = `<${facility * 8 + level}>`; // PRI = Facility * 8 + Severity
        const timestamp: string = args.time.toISOString();

        return Buffer.from(`${PRI}${timestamp} ${this.hostname} ${args.processName}: ${messages.join(' ')}`);
    }
}