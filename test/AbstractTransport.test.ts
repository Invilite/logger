import {LogLevel} from "../src";
import {AbstractTransport} from "../src/Transports";


class ExampleTransport extends AbstractTransport {
    public constructor(logLevel?: LogLevel | string) {
        super(logLevel);
    }

    write(): boolean {
        return false;
    }
}

describe('AbstractTransport class', () => {
    test('"getLogLevel" method should return value passed to constructor', () => {
        const logLevel: LogLevel = LogLevel.notice;
        const exampleTransport: ExampleTransport = new ExampleTransport(logLevel);
        expect(exampleTransport.getLogLevel()).toEqual(logLevel);
    });

    test('"getLogLevel" method should return valid LogLevel is value passed to constructor was string', () => {
        const exampleTransport: ExampleTransport = new ExampleTransport("notice");
        expect(exampleTransport.getLogLevel()).toEqual(LogLevel.notice);
    });

    test('"getLogLevelName" method should return value passed to constructor', () => {
        const exampleTransport: ExampleTransport = new ExampleTransport(LogLevel.emergency);
        expect(exampleTransport.getLogLevelName()).toEqual("emergency");
    });

    test('"getLevelFromName" method should return valid LogLevel from exact match string', () => {
        const logLevel: LogLevel = AbstractTransport.getLevelFromName('info');
        expect(logLevel).toEqual(LogLevel.info);
    });

    test('"getLevelFromName" method should return valid LogLevel from partial match string', () => {
        const logLevel: LogLevel = AbstractTransport.getLevelFromName('warn');
        expect(logLevel).toEqual(LogLevel.warning);
    });

    test('"getLevelFromName" method should return default LogLevel when is unable to match', () => {
        const logLevel: LogLevel = AbstractTransport.getLevelFromName('foo', LogLevel.error);
        expect(logLevel).toEqual(LogLevel.error);
    });

    test('"getLevelFromName" method should return default LogLevel when name is not valid string', () => {
        const logLevel: LogLevel = AbstractTransport.getLevelFromName(undefined, LogLevel.error);
        expect(logLevel).toEqual(LogLevel.error);
    });

    test('"isSupportColors" method should return false by default', () => {
        const exampleTransport: ExampleTransport = new ExampleTransport();
        expect(exampleTransport.isSupportColors()).toEqual(false);
    });
});
