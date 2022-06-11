import dgram from 'dgram';
import {AbstractTransport, TransportArguments} from "./AbstractTransport";
import {LogLevel} from "../Logger";

export class Udp extends AbstractTransport {
    protected timeFormat: string = "";
    protected readonly server: dgram.Socket;

    public constructor(logLevel: LogLevel, protected readonly hostname: string, protected readonly port: number = 514) {
        super(logLevel);
        this.server = dgram.createSocket({
            type: 'udp4'
        });
        this.server.on('error', (error: Error) => this.emit('error', error));
    }

    public write(level: LogLevel, args: TransportArguments, message: string): boolean {
        this.server.send(Buffer.from(message), this.port, this.hostname, (error: Error | null, bytes: number) => {
            this.server.close();
        });

        return true;
    }
}