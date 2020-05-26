export class Logger {
  constructor({level, key = 'DEFAULT'}) {
    this._key = key
    this._level = level
    this._console = console
  }

  trace(log) {
    if (this._level.shouldLogTrace()) {
      this._log({
        level: this._level.getTraceLabel(),
        writter: this._console.trace,
        log
      })
    }
  }

  debug(log) {
    if (this._level.shouldLogDebug()) {
      this._log({
        level: this._level.getDebugLabel(),
        writter: this._console.log,
        log
      })
    }
  }

  info(log) {
    if (this._level.shouldLogInfo()) {
      this._log({
        level: this._level.getInfoLabel(),
        writter: this._console.info,
        log
      })
    }
  }

  warn(log) {
    if (this._level.shouldLogWarn()) {
      this._log({
        level: this._level.getWarnLabel(),
        writter: this._console.warn,
        log
      })
    }
  }

  error(log) {
    if (this._level.shouldLogError()) {
      this._log({
        level: this._level.getErrorLabel(),
        writter: this._console.error,
        log
      })
    }
  }

  fatal(log) {
    if (this._level.shouldLogFatal()) {
      this._log({
        level: this._level.getFatalLabel(),
        writter: this._console.error,
        log
      })
    }
  }

  _log({level, writter, log}) {
    try {
      const label = `${level} | ${this._key} | `
      const args = log()
      if (Array.isArray(args)) writter(label, ...args)
      else writter(label, args)
    } catch (error) {
      this.warn(() => [`Logging error | ${this._key}`, log, error])
    }
  }
}
