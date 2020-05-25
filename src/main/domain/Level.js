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

  shouldLog(logType) {
    return LEVEL[this._level].id <= LEVEL[logType].id
  }

  getLabel(logType) {
    return LEVEL[logType].label
  }
}
