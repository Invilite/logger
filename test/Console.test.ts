import {LogFormat, LogLevel} from "../src";
import {Console} from "../src/Transports";
import {TransportArguments} from "../src/Transports/AbstractTransport";

describe('Console class', () => {
    test('"formatMessage" method be able to return valid JSON object', () => {
        const consoleTransport: Console = new Console(LogLevel.debug, LogFormat.FORMAT_JSON);

        const args: TransportArguments = {
            time: new Date(),
            levelName: "debug",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: "12345",
            processName: "testProcess",
            content: ["Test message"]
        };

        // Call formatMessage method
        const formattedMessage: string = consoleTransport["formatMessage"](LogLevel.debug, args);

        // Check if the result is valid JSON
        expect(() => JSON.parse(formattedMessage)).not.toThrow();
    });

    test('"formatMessage" method return JSON object with time, level and message', () => {
        const consoleTransport: Console = new Console(LogLevel.debug, LogFormat.FORMAT_JSON);

        const args: TransportArguments = {
            time: new Date(),
            levelName: "debug",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName: undefined,
            content: ["Test message", true, { key: 'value' }]
        };

        // Call formatMessage method
        const formattedMessage: string = consoleTransport["formatMessage"](LogLevel.debug, args);
        const json = JSON.parse(formattedMessage);

        // Check the structure of the returned JSON object
        expect(json).toHaveProperty("time");
        expect(json).toHaveProperty("level", "debug");
        expect(json).toHaveProperty("message");
    });

    test('"formatMessage" method return JSON object with valid requestId', () => {
        const consoleTransport: Console = new Console(LogLevel.debug, LogFormat.FORMAT_JSON);
        const requestId: string = "4df9m4hgc";

        const args: TransportArguments = {
            time: new Date(),
            levelName: "debug",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: requestId,
            processName: undefined,
            content: ["Test message"]
        };

        // Call formatMessage method
        const formattedMessage: string = consoleTransport["formatMessage"](LogLevel.debug, args);
        const json = JSON.parse(formattedMessage);

        // Check the structure of the returned JSON object
        expect(json).toHaveProperty("requestId", requestId);
    });

    test('"formatMessage" method return JSON object with valid processName', () => {
        const consoleTransport: Console = new Console(LogLevel.debug, LogFormat.FORMAT_JSON);
        const processName: string = 'worker-1';

        const args: TransportArguments = {
            time: new Date(),
            levelName: "debug",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName,
            content: ["Test message"]
        };

        // Call formatMessage method
        const formattedMessage: string = consoleTransport["formatMessage"](LogLevel.debug, args);
        const json = JSON.parse(formattedMessage);

        // Check the structure of the returned JSON object
        expect(json).toHaveProperty("processName", processName);
    });

    test('"formatMessage" method should be able to parse BigInt object', () => {
        const consoleTransport: Console = new Console(LogLevel.debug, LogFormat.FORMAT_JSON);

        const args: TransportArguments = {
            time: new Date(),
            levelName: "debug",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName: undefined,
            content: ["Test message", 123456, BigInt(4590327293847987)]
        };

        let formattedMessage: string;

        // Call formatMessage method
        expect(() => formattedMessage = consoleTransport["formatMessage"](LogLevel.debug, args)).not.toThrow();

        // Check if the result is valid JSON
        expect(() => JSON.parse(formattedMessage)).not.toThrow();
    });

    test('"write" method should return false for lower log-level then configured', () => {
        const consoleTransport: Console = new Console(LogLevel.emergency);

        const args: TransportArguments = {
            time: new Date(),
            levelName: "",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName: undefined,
            content: ["Test message"]
        };

        // Mock process.stdout.write function
        const writeMock = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

        // Call write for "critical" log level (lower than "emergency")
        expect(consoleTransport.write(LogLevel.critical, args)).toEqual(false);

        // Expect to not call process.stdout.write
        expect(writeMock).toHaveBeenCalledTimes(0);

        // Restore process.stdout.write function
        writeMock.mockRestore();
    });

    test('"write" method should return false for every log when level is set to "silent"', () => {
        const consoleTransport: Console = new Console(LogLevel.silent);

        const args: TransportArguments = {
            time: new Date(),
            levelName: "",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName: undefined,
            content: ["Test message"]
        };

        // Mock process.stdout.write function
        const writeMock = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

        // Call write for every log level
        expect(consoleTransport.write(LogLevel.trace, args)).toEqual(false);
        expect(consoleTransport.write(LogLevel.debug, args)).toEqual(false);
        expect(consoleTransport.write(LogLevel.info, args)).toEqual(false);
        expect(consoleTransport.write(LogLevel.notice, args)).toEqual(false);
        expect(consoleTransport.write(LogLevel.warning, args)).toEqual(false);
        expect(consoleTransport.write(LogLevel.error, args)).toEqual(false);
        expect(consoleTransport.write(LogLevel.alert, args)).toEqual(false);
        expect(consoleTransport.write(LogLevel.critical, args)).toEqual(false);
        expect(consoleTransport.write(LogLevel.emergency, args)).toEqual(false);

        // Expect to not call process.stdout.write
        expect(writeMock).toHaveBeenCalledTimes(0);

        // Restore process.stdout.write function
        writeMock.mockRestore();
    });

    test('"write" method should return true and write to console for higher than set log level', () => {
        const consoleTransport: Console = new Console(LogLevel.info);

        const args: TransportArguments = {
            time: new Date(),
            levelName: "notice",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName: undefined,
            content: ["Test message", new Error("Example error"), false, true]
        };

        // Mock process.stdout.write function
        const writeMock = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

        // Call write for every log level
        expect(consoleTransport.write(LogLevel.notice, args)).toEqual(true);

        // Expect to not call process.stdout.write
        expect(writeMock).toHaveBeenCalledTimes(1);

        // Restore process.stdout.write function
        writeMock.mockRestore();
    });

    test('log message should contain process name if is set', () => {
        const consoleTransport: Console = new Console(LogLevel.debug);
        const processName: string = "worker-process";

        const args: TransportArguments = {
            time: new Date(),
            levelName: "",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName,
            content: ["Test message"]
        };

        // Call formatMessage
        const formattedMessage: string = consoleTransport["formatMessage"](LogLevel.debug, args);

        // Search for a process name
        expect(formattedMessage).toContain(processName);
    });

    test('log message should contain process name if is set and format is set to "color"', () => {
        const consoleTransport: Console = new Console(LogLevel.debug, LogFormat.FORMAT_COLOR);
        const processName: string = "worker-process";

        const args: TransportArguments = {
            time: new Date(),
            levelName: "",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName,
            content: ["Test message"]
        };

        // Call formatMessage
        const formattedMessage: string = consoleTransport["formatMessage"](LogLevel.debug, args);

        // Search for a process name
        expect(formattedMessage).toContain(processName);
    });

    test('log message should contain requestId if is set', () => {
        const consoleTransport: Console = new Console(LogLevel.debug);
        const requestId: string = "3d04tg5dhy9g";

        const args: TransportArguments = {
            time: new Date(),
            levelName: "",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId,
            processName: undefined,
            content: ["Test message"]
        };

        // Call formatMessage
        const formattedMessage: string = consoleTransport["formatMessage"](LogLevel.debug, args);

        // Search for a request id
        expect(formattedMessage).toContain(requestId);
    });

    test('log message should contain requestId if is set and format is set to "color"', () => {
        const consoleTransport: Console = new Console(LogLevel.debug, LogFormat.FORMAT_COLOR);
        const requestId: string = "3d04tg5dhy9g";

        const args: TransportArguments = {
            time: new Date(),
            levelName: "",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId,
            processName: undefined,
            content: ["Test message"]
        };

        // Call formatMessage
        const formattedMessage: string = consoleTransport["formatMessage"](LogLevel.debug, args);

        // Search for a request id
        expect(formattedMessage).toContain(requestId);
    });

    test('log message should contain a readable message', () => {
        const consoleTransport: Console = new Console(LogLevel.debug);
        const message: string = "Test message 1234";

        const args: TransportArguments = {
            time: new Date(),
            levelName: "",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName: undefined,
            content: [message, new Error('Example error'), false, true]
        };

        // Call formatMessage
        const formattedMessage: string = consoleTransport["formatMessage"](LogLevel.debug, args);

        // Search for a message
        expect(formattedMessage).toContain(message);
    });

    test('log message should contain a readable message when format is set to "color"', () => {
        const consoleTransport: Console = new Console(LogLevel.debug, LogFormat.FORMAT_COLOR);
        const message: string = "Test message 1234";

        const args: TransportArguments = {
            time: new Date(),
            levelName: "",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName: undefined,
            content: [message, new Error('Example error'), false, true]
        };

        // Call formatMessage
        const formattedMessage: string = consoleTransport["formatMessage"](LogLevel.debug, args);

        // Search for a message
        expect(formattedMessage).toContain(message);
    });
});
