# @invilite/logger
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/9bdbdeea92924bc0b77589082022560c)](https://www.codacy.com/gh/Invilite/logger/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Invilite/logger&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/7331386c0e83753b34a2/maintainability)](https://codeclimate.com/github/Invilite/logger/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/invilite/logger/badge.svg)](https://snyk.io/test/github/invilite/logger)
[![Version](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=version&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2FInvilite%2Flogger%2Fmaster%2Fpackage.json)](https://github.com/Invilite/logger/blob/master/package.json)
[![License](https://img.shields.io/badge/license-GPL--3.0-blue)](https://github.com/Invilite/logger/blob/master/LICENSE)

Simple but powerful logger using [RFC-5424](https://datatracker.ietf.org/doc/html/rfc5424), compatible with Syslog.

## Highlights
- Focus on high performance
- TypeScript type definitions included

## Install
This is a Node.js module available through the npm registry.

Using npm:
```shell
$ npm install @invilite/logger
```

Using bower:
```shell
$ bower install @invilite/logger
```

Using yarn:
```shell
$ yarn add @invilite/logger
```

## Usage

```typescript
import {Logger, LogLevel, LogFormat} from "@invilite/logger";
import {Console} from "@invilite/Transports";

const logger = new Logger();
logger.addTransport(new Console(LogLevel.debug, LogFormat.FORMAT_COLOR));

logger.trace("This is long trace message, used to trace errors", process.argv);
logger.debug("Example debug log, debug is:", false);
logger.info("Example info content.");
```

## Methods

### addTransport()
Register new transport.

#### Syntax
```
addTransport(transport: AbstractTransport): Logger;
```

#### Example
```typescript
const logger = new Logger();
logger.addTransport(new Console(LogLevel.debug, LogFormat.FORMAT_COLOR));
```

### setTransports()
Replace all transports.

#### Syntax
```
setTransports(transports: AbstractTransport[]): Logger;
```

#### Example
```typescript
const logger = new Logger();
logger.setTransports([
    new Console(LogLevel.debug, LogFormat.FORMAT_COLOR)
]);
```

### setTimeFormat()
Set time format, in format used by [@invilite/date](https://github.com/Invilite/date)@format().

#### Syntax
```
setTimeFormat(format: string): Logger;
```

### getTimeFormat()
Get current time format.

#### Syntax
```
getTimeFormat(): string;
```


## License
Library is licensed under a [GNU General Public License v3.0](https://github.com/Invilite/logger/blob/master/LICENSE)