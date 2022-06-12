import {Logger, LogLevel} from "../src/Logger";
import {Console} from "../src/Transports";

describe('Logger class', () => {
    test('"log" method should call "write" for every registered transport', () => {
        const loggerLogMock = jest.spyOn(Console.prototype, "write").mockClear();
        const console = new Console(LogLevel.silent);
        const logger = new Logger();

        // Register 3 transports
        logger.addTransport(console);
        logger.addTransport(console);
        logger.addTransport(console);

        // Send one message
        logger.debug("Example message");

        // Expect to be called 3 times
        expect(loggerLogMock).toHaveBeenCalledTimes(3);
    });

    test('verbose should call "log" method once with "trace" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.trace);
        }).mockClear();

        new Logger().verbose("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);
    });

    test('trace should call "log" method once with "trace" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.trace);
        }).mockClear();

        new Logger().trace("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);
    });

    test('debug should call "log" method once with "debug" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.debug);
        }).mockClear();

        new Logger().debug("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);
    });

    test('info should call "log" method once with "info" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.info);
        }).mockClear();

        new Logger().info("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);
    });

    test('notice should call "log" method once with "notice" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.notice);
        }).mockClear();

        new Logger().notice("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);
    });

    test('warning should call "log" method once with "warning" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.warning);
        }).mockClear();

        new Logger().warning("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);
    });

    test('error should call "log" method once with "error" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.error);
        }).mockClear();

        new Logger().error("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);
    });

    test('critical should call "log" method once with "critical" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.critical);
        }).mockClear();

        new Logger().critical("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);
    });

    test('alert should call "log" method once with "alert" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.alert);
        }).mockClear();

        new Logger().alert("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);
    });

    test('emergency should call "log" method once with "emergency" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.emergency);
        }).mockClear();

        new Logger().emergency("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);
    });

    test('emergency should call "log" method once with "emergency" level', () => {
        const loggerLogMock = jest.spyOn(Logger.prototype, "log").mockImplementation((level: LogLevel) => {
            expect(level).toEqual(LogLevel.emergency);
        }).mockClear();

        new Logger().emergency("Example message");
        expect(loggerLogMock).toHaveBeenCalledTimes(1);
    });

    test('"getTimeFormat" method should return value set by "setTimeFormat"', () => {
        const logger = new Logger();
        logger.setTimeFormat("DD HH:mm:ss.S");

        expect(logger.getTimeFormat()).toEqual("DD HH:mm:ss.S");
    });
});
