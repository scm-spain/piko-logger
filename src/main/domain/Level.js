import {LOCAL_STORAGE_KEY, DEFAULT_LEVEL, LEVEL} from './constants'

export class Level {
  constructor({key}) {
    this._key = key
    this._level =
      window?.localStorage?.getItem(`${LOCAL_STORAGE_KEY}.${key}`) ||
      window?.localStorage?.getItem(LOCAL_STORAGE_KEY) ||
      DEFAULT_LEVEL
  }

  shouldLog(logType) {
    return LEVEL[this._level].id <= LEVEL[logType].id
  }

  getLabel(logType) {
    return LEVEL[logType].label
  }
}
