import {Logger, LogLevel} from "../src";
import {Console} from "../src/Transports";

describe('Logger class', () => {
    test('"log" method should call "write" for every registered transport', () => {
        const writeMock = jest.spyOn(Console.prototype, "write").mockImplementation(() => true).mockClear();
        const consoleTransport: Console = new Console(LogLevel.trace);
        const logger: Logger = new Logger();

        // Register 3 transports
        logger.addTransport(consoleTransport);
        logger.addTransport(consoleTransport);
        logger.addTransport(consoleTransport);

        // Send one message
        logger.debug("Example message 1");

        // Expect to be called 3 times
        expect(writeMock).toHaveBeenCalledTimes(3);

        // Restore writeMock method
        writeMock.mockRestore();
    });

    test('"log" method should call "write" for every transport passed to constructor', () => {
        const writeMock = jest.spyOn(Console.prototype, "write").mockImplementation(() => true).mockClear();
        const logger: Logger = new Logger(undefined, [
            new Console(LogLevel.trace),
            new Console(LogLevel.trace)
        ]);

        // Send one message
        logger.info("Example message 2");

        // Expect to be called 2 times
        expect(writeMock).toHaveBeenCalledTimes(2);

        // Restore writeMock method
        writeMock.mockRestore();
    });

    test('"log" method should not call "write" when transports was cleared', () => {
        const writeMock = jest.spyOn(Console.prototype, "write").mockImplementation(() => true).mockClear();
        const console: Console = new Console(LogLevel.trace);
        const logger: Logger = new Logger();

        // Register 3 transports
        logger.addTransport(console);
        logger.addTransport(console);
        logger.addTransport(console);

        // Clear transports
        logger.clearTransports();

        // Send one message
        logger.debug("Example message");

        // Expect to be called 0 times
        expect(writeMock).toHaveBeenCalledTimes(0);

        // Restore writeMock method
        writeMock.mockRestore();
    });

    test('"addTransport" method should add transports to existing passed to constructor', () => {
        const console: Console = new Console(LogLevel.silent);
        const logger: Logger = new Logger(undefined, [
            new Console(LogLevel.trace),
            new Console(LogLevel.trace)
        ]);

        // Register 3 additional transports
        logger.addTransport(console);
        logger.addTransport(console);
        logger.addTransport(console);

        // Expect to return 5 transports
        expect(logger.getTransports().length).toEqual(5);
    });

    test('"setTransports" method should overwrite existing transports', () => {
        const console: Console = new Console(LogLevel.silent);
        const logger: Logger = new Logger();

        // Register 3 transports
        logger.addTransport(console);
        logger.addTransport(console);
        logger.addTransport(console);

        // Set one transport
        logger.setTransports([console]);

        // Expect to return 1 transport
        expect(logger.getTransports().length).toEqual(1);
    });

    test('"removeTransport" method should remove one existing transport', () => {
        const console1: Console = new Console(LogLevel.debug);
        const console2: Console = new Console(LogLevel.debug);
        const console3: Console = new Console(LogLevel.debug);
        const logger: Logger = new Logger();

        // Set transports
        logger.setTransports([console1, console2, console3]);

        // Remove one transport
        logger.removeTransport(console2);

        // Expect to return 2 transports
        expect(logger.getTransports().length).toEqual(2);
    });

    test('verbose should call "log" method once with "trace" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.trace);
        }).mockClear();

        new Logger().verbose("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);

        // Restore log method
        loggerLogMock.mockRestore();
    });

    test('trace should call "log" method once with "trace" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.trace);
        }).mockClear();

        new Logger().trace("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);

        // Restore log method
        loggerLogMock.mockRestore();
    });

    test('debug should call "log" method once with "debug" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.debug);
        }).mockClear();

        new Logger().debug("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);

        // Restore log method
        loggerLogMock.mockRestore();
    });

    test('info should call "log" method once with "info" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.info);
        }).mockClear();

        new Logger().info("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);

        // Restore log method
        loggerLogMock.mockRestore();
    });

    test('notice should call "log" method once with "notice" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.notice);
        }).mockClear();

        new Logger().notice("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);

        // Restore log method
        loggerLogMock.mockRestore();
    });

    test('warning should call "log" method once with "warning" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.warning);
        }).mockClear();

        new Logger().warning("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);

        // Restore log method
        loggerLogMock.mockRestore();
    });

    test('error should call "log" method once with "error" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.error);
        }).mockClear();

        new Logger().error("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);

        // Restore log method
        loggerLogMock.mockRestore();
    });

    test('critical should call "log" method once with "critical" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.critical);
        }).mockClear();

        new Logger().critical("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);

        // Restore log method
        loggerLogMock.mockRestore();
    });

    test('alert should call "log" method once with "alert" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.alert);
        }).mockClear();

        new Logger().alert("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);

        // Restore log method
        loggerLogMock.mockRestore();
    });

    test('emergency should call "log" method once with "emergency" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.emergency);
        }).mockClear();

        new Logger().emergency("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);

        // Restore log method
        loggerLogMock.mockRestore();
    });

    test('"getTimeFormat" method should return value set by "setTimeFormat"', () => {
        const logger: Logger = new Logger();
        logger.setTimeFormat("DD HH:mm:ss.S");

        expect(logger.getTimeFormat()).toEqual("DD HH:mm:ss.S");
    });

    test('"getTimeFormat" method should return value set by "timeFormat" option in constructor', () => {
        const logger: Logger = new Logger({
            timeFormat: "DD HH:mm:ss.S"
        });

        expect(logger.getTimeFormat()).toEqual("DD HH:mm:ss.S");
    });

    test('"clone" method should be able to overwrite LoggerOptions timeFormat value', () => {
        const logger: Logger = new Logger({
            timeFormat: "DD HH:mm:ss.S"
        });

        const newLogger: Logger = logger.clone({
            timeFormat: "HH:mm:ss"
        });

        expect(newLogger.getTimeFormat()).toEqual("HH:mm:ss");
    });
});
