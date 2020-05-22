export class Logger {
  constructor({level, key}) {
    this._key = key
    this._level = level
    this._console = console
  }

  debug(log) {
    if (this._level.shouldLog('debug')) {
      this._log({
        level: this._level.getLabel('debug'),
        writter: this._console.log,
        log
      })
    }
  }

  error(log) {
    if (this._level.shouldLog('error')) {
      this._log({
        level: this._level.getLabel('error'),
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
