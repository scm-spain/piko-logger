# Piko Logger

[![Build status](https://travis-ci.org/scm-spain/piko-logger.svg?branch=master)](https://travis-ci.org/scm-spain/piko-logger)
[![codecov](https://codecov.io/gh/scm-spain/piko-logger/branch/master/graph/badge.svg)](https://codecov.io/gh/scm-spain/piko-logger)
[![GitHub license](https://img.shields.io/github/license/scm-spain/piko-logger.svg)](https://github.com/scm-spain/piko-logger/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@adv-ui/piko-logger.svg)](https://www.npmjs.com/package/@adv-ui/piko-logger)

## Table of Contents

* [About](#about)
* [Features](#features)
* [Technical features](#technical-features)
* [Configuration](#configuration)
* [Usage](#usage)
* [License](#license)


## About

Piko Logger is a tiny logger for web environments. 

## Features

- It's enabled/disabled through local storage
- Can create an instance of a keyed logger
- Log operations are called in functional way to avoid executions on non-activated log operations 
- There are thwo log levels:
    - Debug
    - Error
- Will format keyed loggers as: LOG_LEVEL | #KEY# | #MESSAGE#

## Technical features

## Usage

### Enable/disable the logger
By default the log level is set to off, so logs are disabled.
There are two levels of enabling it:
- Application level: 
    
    *"piko.level" = #logLevel*

    ```code
    window.localStorage.setItem('piko.level', 'debug')
    ```
- Keyed logger level:
    
    *"piko.level.#key" = #logLevel*

    Example for a logger initialized with a key with value "exampleKey"
    ```code
    window.localStorage.setItem('piko.level.exampleKey', 'error')
    ```
*The keyed logger level overrides the application level, which in turn overrides the default logger level

### Initialize the logger
The logger should be initialized with a custom key to identify the logger. 
* key (string): the **unique tracker name/identifier** that will be used to generate the outputs

```code
import Piko from '@adv-ui/piko-logger'

const logger = Piko.logger('MyLibrary')

....

// optionally use a tagged instance of logger to fine grain where the logged action occurs

const taggedLogger = logger.tag('MyFunction')

// using the logger methods, logs will show a reference to 'MyLibrary' 
// using the taggedLogger methods, logs will show a reference to 'MyLibrary # MyFunction' 

```

### Log
Once a logger is initialized with a key, that instance should be used to log.

There are six exposed methods, one for each log level (trace, debug, info, warn, error, fatal)

Log info should be passed in a functional way, to avoid execution if the log level is non-activated

If more than one thing should be logged in the same trace, the function should return an array

All data types could be logged

```code
logger.debug(()=> "this is the info I want to log")
const error = {
    name: 'example error', 
    message: 'example error message'
}
logger.error(()=> ["this is the error I want to log", {error}])
```

This two example logs will appear in the console like this (using "example" as the key):

DEBUG | example | this is the info I want to log


ERROR | example |  this is the error I want to log {name: "example error", message: "example error message"}

## License
Piko Logger is [MIT licensed](./LICENSE).
