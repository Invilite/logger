import dgram from 'dgram';
import {AbstractTransport, TransportArguments} from "./AbstractTransport";
import {LogLevel} from "../Logger";

export class Udp extends AbstractTransport {
    protected timeFormat = "";
    protected readonly server: dgram.Socket;

    public constructor(logLevel: LogLevel, protected readonly hostname: string, protected readonly port: number = 514) {
        super(logLevel);
        this.server = dgram.createSocket({
            type: 'udp4'
        });
        this.server.on('error', (error: Error) => this.emit('error', error));
    }

    public write(level: LogLevel, args: TransportArguments, message: string): boolean {
        if (this.logLevel < level) {
            return false;
        }
        this.server.send(Buffer.from(message), this.port, this.hostname, (error: Error | null) => {
            this.server.close();

            if (error) {
                this.emit('error', error);
            }
        });

        return true;
    }
}