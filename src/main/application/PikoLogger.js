import {Level} from '../domain/Level'
import {Logger} from '../domain/Logger'

export class PikoLogger {
  constructor() {
    this._logger = new Map()
  }

  logger(key) {
    const level = new Level({key})
    const logger = new Logger({level, key})
    if (!this._logger.get(key)) {
      this._logger.set(key, logger)
      return logger
    } else {
      return this._logger.get(key)
    }
  }
}
