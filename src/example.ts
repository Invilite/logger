import {Logger, LogLevel} from "./Logger";
import {Console, File, Udp} from "./Transports";
import {AbstractTransport} from "./Transports/AbstractTransport";
import {LogFormat} from "./Transports/Console";

const logLevel: LogLevel = LogLevel.trace;
const loggerTransports: AbstractTransport[] = [
    new Console(logLevel, LogFormat.FORMAT_COLOR),
    new File(logLevel, LogFormat.FORMAT_PLAIN, './log.txt'),
    new Udp(logLevel, 'router.lan'),
];

const logger = new Logger();
logger.setTransports(loggerTransports);

logger.trace("This is long trace message, used to trace errors", process.argv);
logger.debug("Example debug log, debug is:", false);
logger.info("Example info content", true);
logger.notice("Example log with symbol", Symbol("foo"), (a: number) => a*2);
logger.warning("This is some warning level log");
logger.error("Example error message", BigInt(Number.MAX_SAFE_INTEGER), new Error('this is error.'));
logger.critical("Critical message", { foo: 'baz', bar: 1}, undefined);
logger.alert('Alert message');
logger.emergency('This is bad. Call the Admin!');
