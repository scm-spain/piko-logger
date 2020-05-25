import {LOCAL_STORAGE_KEY, DEFAULT_LEVEL, LEVEL} from './constants'

export class Level {
  constructor({key}) {
    this._key = key
    this._level = this._getLevel()
  }

  _getLevel() {
    if (typeof window !== 'undefined') {
      try {
        return (
          window.localStorage.getItem(`${LOCAL_STORAGE_KEY}.${this._key}`) ||
          window.localStorage.getItem(LOCAL_STORAGE_KEY) ||
          DEFAULT_LEVEL
        )
      } catch {
        return DEFAULT_LEVEL
      }
    }
  }

  shouldLogTrace() {
    return LEVEL[this._level].id <= LEVEL.trace.id
  }

  shouldLogDebug() {
    return LEVEL[this._level].id <= LEVEL.debug.id
  }

  shouldLogInfo() {
    return LEVEL[this._level].id <= LEVEL.info.id
  }

  shouldLogWarn() {
    return LEVEL[this._level].id <= LEVEL.warn.id
  }

  shouldLogError() {
    return LEVEL[this._level].id <= LEVEL.error.id
  }

  shouldLogFatal() {
    return LEVEL[this._level].id <= LEVEL.fatal.id
  }

  getTraceLabel() {
    return LEVEL.trace.label
  }

  getDebugLabel() {
    return LEVEL.debug.label
  }

  getInfoLabel() {
    return LEVEL.info.label
  }

  getWarnLabel() {
    return LEVEL.warn.label
  }

  getErrorLabel() {
    return LEVEL.error.label
  }

  getFatalLabel() {
    return LEVEL.fatal.label
  }
}
