import * as fs from "fs";
import {File} from "../src/Transports";
import {LogFormat, LogLevel} from "../src";
import {TransportArguments} from "../src/Transports/AbstractTransport";

const writeStreamMock = {
    write: jest.fn(),
    end: jest.fn(),
    on: jest.fn()
};

jest.mock('fs', () => ({
    createWriteStream: jest.fn()
}));
(fs.createWriteStream as jest.Mock).mockReturnValue(writeStreamMock);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('File class', () => {
    test('"write" method should open createWriteStream and call write', () => {
        const filePath: string = "./testFile.txt";
        const fileTransport: File = new File(LogLevel.info, LogFormat.FORMAT_PLAIN, filePath);

        const args: TransportArguments = {
            time: new Date(),
            levelName: "notice",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName: undefined,
            content: ["Test message", new Error("Example error"), false, true]
        };

        // Call write and expect to return true
        expect(fileTransport.write(LogLevel.notice, args)).toEqual(true);

        // Expect createWriteStream to be called one time
        expect(fs.createWriteStream as jest.Mock).toHaveBeenCalledTimes(1);

        // Expect createWriteStream to be called with file path as first argument
        expect((fs.createWriteStream as jest.Mock).mock.calls[0][0]).toBe(filePath);
    });

    test('"write" method should return false after calling "closeFile" method', () => {
        const filePath: string = "./testFile.txt";
        const fileTransport: File = new File(LogLevel.info, LogFormat.FORMAT_PLAIN, filePath);

        const args: TransportArguments = {
            time: new Date(),
            levelName: "notice",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName: undefined,
            content: ["Test message", new Error("Example error"), false, true]
        };

        // Call close method
        fileTransport.closeFile();

        // Call write and expect to return false
        expect(fileTransport.write(LogLevel.notice, args)).toEqual(false);
    });

    test('"closeFile" method should not try to close writeStream twice', () => {
        const filePath: string = "./testFile.txt";
        const fileTransport: File = new File(LogLevel.info, LogFormat.FORMAT_PLAIN, filePath);

        // Call close method 3 times
        fileTransport.closeFile();
        fileTransport.closeFile();
        fileTransport.closeFile();

        // Expect writeStream.end() to be called 1 time
        expect(writeStreamMock.end).toHaveBeenCalledTimes(1);
    });

    test('"write" method should return false for every log when level is set to "silent"', () => {
        const filePath: string = "./testFile.txt";
        const fileTransport: File = new File(LogLevel.silent, LogFormat.FORMAT_PLAIN, filePath);

        const args: TransportArguments = {
            time: new Date(),
            levelName: "",
            timeString: "2023-09-07T12:00:00.000Z",
            requestId: undefined,
            processName: undefined,
            content: ["Test message"]
        };

        // Call write for every log level
        expect(fileTransport.write(LogLevel.trace, args)).toEqual(false);
        expect(fileTransport.write(LogLevel.debug, args)).toEqual(false);
        expect(fileTransport.write(LogLevel.info, args)).toEqual(false);
        expect(fileTransport.write(LogLevel.notice, args)).toEqual(false);
        expect(fileTransport.write(LogLevel.warning, args)).toEqual(false);
        expect(fileTransport.write(LogLevel.error, args)).toEqual(false);
        expect(fileTransport.write(LogLevel.alert, args)).toEqual(false);
        expect(fileTransport.write(LogLevel.critical, args)).toEqual(false);
        expect(fileTransport.write(LogLevel.emergency, args)).toEqual(false);
    });
});
