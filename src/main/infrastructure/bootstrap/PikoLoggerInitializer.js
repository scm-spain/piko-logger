import {PikoLogger} from '../../application/PikoLogger'

class PikoLoggerInitializer {
  static init() {
    return new PikoLogger()
  }
}

export {PikoLoggerInitializer}
