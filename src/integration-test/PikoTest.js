import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import sinon from 'sinon'
import Piko from '../main/index'
import {DEFAULT_LEVEL} from '../main/domain/constants'

describe('Piko', () => {
  const dom = new JSDOM('<!DOCTYPE html><body></body>', {
    url: 'http://localhost'
  })
  global.window = dom.window
  global.document = dom.window.document

  describe('logger method', () => {
    let consoleDebug
    let consoleError
    let consoleTrace
    let consoleInfo
    let consoleWarn
    let debugSpy
    let errorSpy
    let warnSpy
    let traceSpy
    let infoSpy
    const aDebugMessage = 'debug testing'
    const anErrorMessage = 'error testing'
    const aTraceMessage = 'trace testing'
    const anInfoMessage = 'info testing'
    const aFatalMessage = 'fatal testing'
    const aWarnMessage = 'warn testing'

    before(() => {
      consoleDebug = console.log
      consoleError = console.error
      consoleTrace = console.trace
      consoleInfo = console.info
      consoleWarn = console.warn
      console.log = () => null
      console.error = () => null
      console.trace = () => null
      console.info = () => null
      console.warn = () => null
      debugSpy = sinon.spy(console, 'log')
      errorSpy = sinon.spy(console, 'error')
      traceSpy = sinon.spy(console, 'trace')
      infoSpy = sinon.spy(console, 'info')
      warnSpy = sinon.spy(console, 'warn')
    })

    after(() => {
      console.log = consoleDebug
      console.error = consoleError
      console.trace = consoleTrace
      console.info = consoleInfo
      console.warn = consoleWarn
    })

    beforeEach(() => {
      window.localStorage.clear()
      window.localStorage.setItem('piko.level', 'off')
      debugSpy.resetHistory()
      errorSpy.resetHistory()
      traceSpy.resetHistory()
      infoSpy.resetHistory()
      warnSpy.resetHistory()
      // To simulate a different module importation
      Piko._logger.clear()
    })

    it('should log corresponding levels when initialized in localStorage with "trace"', () => {
      const loggerKey = 'test'
      window.localStorage.setItem(`piko.level.${loggerKey}`, 'trace')
      const aDebugMessage2 = 'debug testing 2'
      const aWarnMessage2 = 'warn message 2'
      const error = new Error('test error message')
      const logger = Piko.logger(loggerKey)

      logger.debug(() => aDebugMessage)
      logger.debug(() => aDebugMessage2)
      logger.error(() => [anErrorMessage, {error}])
      logger.trace(() => aTraceMessage)
      logger.info(() => anInfoMessage)
      logger.fatal(() => aFatalMessage)
      logger.warn(() => aWarnMessage)
      logger.warn(() => [aWarnMessage, aWarnMessage2])

      expect(debugSpy.callCount).to.equal(2)
      expect(debugSpy.args[0][0]).to.equal('DEBUG | test | ')
      expect(debugSpy.args[0][1]).to.equal(aDebugMessage)
      expect(debugSpy.args[1][0]).to.equal('DEBUG | test | ')
      expect(debugSpy.args[1][1]).to.equal(aDebugMessage2)
      expect(errorSpy.callCount).to.equal(2)
      expect(errorSpy.args[0][0]).to.equal('ERROR | test | ')
      expect(errorSpy.args[0][1]).to.equal(anErrorMessage)
      expect(errorSpy.args[0][2]).to.deep.equal({error})
      expect(errorSpy.args[1][0]).to.equal('FATAL | test | ')
      expect(errorSpy.args[1][1]).to.equal(aFatalMessage)
      expect(traceSpy.callCount).to.equal(1)
      expect(infoSpy.callCount).to.equal(1)
      expect(infoSpy.args[0][0]).to.equal('INFO | test | ')
      expect(infoSpy.args[0][1]).to.equal(anInfoMessage)
      expect(warnSpy.callCount).to.equal(2)
      expect(warnSpy.args[0][0]).to.equal('WARN | test | ')
      expect(warnSpy.args[0][1]).to.equal(aWarnMessage)
      expect(warnSpy.args[1][0]).to.equal('WARN | test | ')
      expect(warnSpy.args[1][1]).to.equal(aWarnMessage)
      expect(warnSpy.args[1][2]).to.equal(aWarnMessage2)
    })

    it('should log corresponding levels when initialized in localStorage with "debug"', () => {
      const loggerKey = 'test'
      window.localStorage.setItem(`piko.level.${loggerKey}`, 'debug')
      const aDebugMessage2 = 'debug testing 2'

      const logger = Piko.logger(loggerKey)

      logger.debug(() => aDebugMessage)
      logger.debug(() => aDebugMessage2)
      logger.error(() => anErrorMessage)
      logger.trace(() => aTraceMessage)
      logger.info(() => anInfoMessage)
      logger.fatal(() => aFatalMessage)
      logger.warn(() => aWarnMessage)

      expect(debugSpy.callCount).to.equal(2)
      expect(debugSpy.args[0][0]).to.equal('DEBUG | test | ')
      expect(debugSpy.args[0][1]).to.equal(aDebugMessage)
      expect(debugSpy.args[1][0]).to.equal('DEBUG | test | ')
      expect(debugSpy.args[1][1]).to.equal(aDebugMessage2)
      expect(errorSpy.callCount).to.equal(2)
      expect(errorSpy.args[0][0]).to.equal('ERROR | test | ')
      expect(errorSpy.args[0][1]).to.equal(anErrorMessage)
      expect(errorSpy.args[1][0]).to.equal('FATAL | test | ')
      expect(errorSpy.args[1][1]).to.equal(aFatalMessage)
      expect(traceSpy.callCount).to.equal(0)
      expect(infoSpy.callCount).to.equal(1)
      expect(infoSpy.args[0][0]).to.equal('INFO | test | ')
      expect(infoSpy.args[0][1]).to.equal(anInfoMessage)
      expect(warnSpy.callCount).to.equal(1)
      expect(warnSpy.args[0][0]).to.equal('WARN | test | ')
      expect(warnSpy.args[0][1]).to.equal(aWarnMessage)
    })

    it('should log corresponding levels when initialized in localStorage with "info"', () => {
      const loggerKey = 'test'
      window.localStorage.setItem(`piko.level.${loggerKey}`, 'info')
      const aDebugMessage2 = 'debug testing 2'

      const logger = Piko.logger(loggerKey)

      logger.debug(() => aDebugMessage)
      logger.debug(() => aDebugMessage2)
      logger.error(() => anErrorMessage)
      logger.trace(() => aTraceMessage)
      logger.info(() => anInfoMessage)
      logger.fatal(() => aFatalMessage)
      logger.warn(() => aWarnMessage)

      expect(debugSpy.callCount).to.equal(0)
      expect(errorSpy.callCount).to.equal(2)
      expect(errorSpy.args[0][0]).to.equal('ERROR | test | ')
      expect(errorSpy.args[0][1]).to.equal(anErrorMessage)
      expect(errorSpy.args[1][0]).to.equal('FATAL | test | ')
      expect(errorSpy.args[1][1]).to.equal(aFatalMessage)
      expect(traceSpy.callCount).to.equal(0)
      expect(infoSpy.callCount).to.equal(1)
      expect(infoSpy.args[0][0]).to.equal('INFO | test | ')
      expect(infoSpy.args[0][1]).to.equal(anInfoMessage)
      expect(warnSpy.callCount).to.equal(1)
      expect(warnSpy.args[0][0]).to.equal('WARN | test | ')
      expect(warnSpy.args[0][1]).to.equal(aWarnMessage)
    })

    it('should log corresponding levels when initialized in localStorage with "warn"', () => {
      const loggerKey = 'test'
      window.localStorage.setItem(`piko.level.${loggerKey}`, 'warn')
      const aDebugMessage2 = 'debug testing 2'

      const logger = Piko.logger(loggerKey)

      logger.debug(() => aDebugMessage)
      logger.debug(() => aDebugMessage2)
      logger.error(() => anErrorMessage)
      logger.trace(() => aTraceMessage)
      logger.info(() => anInfoMessage)
      logger.fatal(() => aFatalMessage)
      logger.warn(() => aWarnMessage)

      expect(debugSpy.callCount).to.equal(0)
      expect(errorSpy.callCount).to.equal(2)
      expect(errorSpy.args[0][0]).to.equal('ERROR | test | ')
      expect(errorSpy.args[0][1]).to.equal(anErrorMessage)
      expect(errorSpy.args[1][0]).to.equal('FATAL | test | ')
      expect(errorSpy.args[1][1]).to.equal(aFatalMessage)
      expect(traceSpy.callCount).to.equal(0)
      expect(infoSpy.callCount).to.equal(0)
      expect(warnSpy.callCount).to.equal(1)
      expect(warnSpy.args[0][0]).to.equal('WARN | test | ')
      expect(warnSpy.args[0][1]).to.equal(aWarnMessage)
    })

    it('should log only error and fatal level when initialized in localStorage with "error"', () => {
      const loggerKey = 'test'
      window.localStorage.setItem(`piko.level.${loggerKey}`, 'error')

      const logger = Piko.logger(loggerKey)
      logger.debug(() => aDebugMessage)
      logger.error(() => anErrorMessage)
      logger.fatal(() => aFatalMessage)

      expect(debugSpy.callCount).to.equal(0)
      expect(errorSpy.callCount).to.equal(2)
      expect(errorSpy.args[0][0]).to.equal('ERROR | test | ')
      expect(errorSpy.args[0][1]).to.equal(anErrorMessage)
      expect(errorSpy.args[1][0]).to.equal('FATAL | test | ')
      expect(errorSpy.args[1][1]).to.equal(aFatalMessage)
    })

    it('should log only fatal level when initialized in localStorage with "fatal"', () => {
      const loggerKey = 'test'
      window.localStorage.setItem(`piko.level.${loggerKey}`, 'fatal')
      const aDebugMessage2 = 'debug testing 2'

      const logger = Piko.logger(loggerKey)

      logger.debug(() => aDebugMessage)
      logger.debug(() => aDebugMessage2)
      logger.error(() => anErrorMessage)
      logger.trace(() => aTraceMessage)
      logger.info(() => anInfoMessage)
      logger.fatal(() => aFatalMessage)
      logger.warn(() => aWarnMessage)

      expect(debugSpy.callCount).to.equal(0)
      expect(errorSpy.callCount).to.equal(1)
      expect(errorSpy.args[0][0]).to.equal('FATAL | test | ')
      expect(errorSpy.args[0][1]).to.equal(aFatalMessage)
      expect(traceSpy.callCount).to.equal(0)
      expect(infoSpy.callCount).to.equal(0)
      expect(warnSpy.callCount).to.equal(0)
    })

    it('should not log any level when initialized in localStorage with "off"', () => {
      const loggerKey = 'test'

      const logger = Piko.logger(loggerKey)
      logger.debug(() => aDebugMessage)
      logger.error(() => anErrorMessage)
      logger.trace(() => aTraceMessage)
      logger.info(() => anInfoMessage)
      logger.fatal(() => aFatalMessage)

      expect(debugSpy.callCount).to.equal(0)
      expect(errorSpy.callCount).to.equal(0)
      expect(traceSpy.callCount).to.equal(0)
      expect(infoSpy.callCount).to.equal(0)
    })

    it('should log all levels when initialized in localStorage with "all"', () => {
      const loggerKey = 'test'
      window.localStorage.setItem(`piko.level.${loggerKey}`, 'all')

      const logger = Piko.logger(loggerKey)
      logger.debug(() => aDebugMessage)
      logger.error(() => anErrorMessage)
      logger.trace(() => aTraceMessage)
      logger.info(() => anInfoMessage)
      logger.fatal(() => aFatalMessage)

      expect(debugSpy.callCount).to.equal(1)
      expect(errorSpy.callCount).to.equal(2)
      expect(traceSpy.callCount).to.equal(1)
      expect(infoSpy.callCount).to.equal(1)
    })

    it('should not log any level when not initialized in localStorage', () => {
      window.localStorage.clear()
      const loggerKey = 'test'

      const logger = Piko.logger(loggerKey)
      logger.debug(() => aDebugMessage)
      logger.error(() => anErrorMessage)
      logger.trace(() => aTraceMessage)
      logger.info(() => anInfoMessage)
      logger.fatal(() => aFatalMessage)

      expect(debugSpy.callCount).to.equal(0)
      expect(errorSpy.callCount).to.equal(0)
      expect(traceSpy.callCount).to.equal(0)
      expect(infoSpy.callCount).to.equal(0)
    })

    it('should log corresponding level for each initializated logger', () => {
      const loggerKey1 = 'test'
      const loggerKey2 = 'test2'
      window.localStorage.setItem(`piko.level.${loggerKey1}`, 'debug')
      window.localStorage.setItem(`piko.level.${loggerKey2}`, 'error')
      const aDebugMessage2 = 'debug testing 2'
      const anErrorMessage2 = 'error testing 2'

      const logger1 = Piko.logger(loggerKey1)
      logger1.debug(() => aDebugMessage)
      logger1.debug(() => aDebugMessage2)
      logger1.error(() => anErrorMessage)

      const logger2 = Piko.logger(loggerKey2)
      logger2.debug(() => aDebugMessage)
      logger2.debug(() => aDebugMessage2)
      logger2.error(() => anErrorMessage)
      logger2.error(() => anErrorMessage2)

      expect(debugSpy.callCount).to.equal(2)
      expect(debugSpy.args[0][0]).to.equal('DEBUG | test | ')
      expect(debugSpy.args[0][1]).to.equal(aDebugMessage)
      expect(debugSpy.args[1][0]).to.equal('DEBUG | test | ')
      expect(debugSpy.args[1][1]).to.equal(aDebugMessage2)
      expect(errorSpy.callCount).to.equal(3)
      expect(errorSpy.args[0][0]).to.equal('ERROR | test | ')
      expect(errorSpy.args[0][1]).to.equal(anErrorMessage)
      expect(errorSpy.args[1][0]).to.equal('ERROR | test2 | ')
      expect(errorSpy.args[1][1]).to.equal(anErrorMessage)
      expect(errorSpy.args[2][0]).to.equal('ERROR | test2 | ')
      expect(errorSpy.args[2][1]).to.equal(anErrorMessage2)
    })
    it('should log more than one data', () => {
      const loggerKey = 'test'
      window.localStorage.setItem(`piko.level.${loggerKey}`, 'fatal')
      const error = new Error('fatal error message')

      const logger = Piko.logger(loggerKey)

      logger.fatal(() => [aFatalMessage, error])

      expect(errorSpy.callCount).to.equal(1)
      expect(errorSpy.args[0][0]).to.equal('FATAL | test | ')
      expect(errorSpy.args[0][1]).to.equal(aFatalMessage)
      expect(errorSpy.args[0][2]).to.equal(error)
    })
    it('should not fail on invalid configured level', () => {
      const key1 = 'key1'
      const key2 = 'key2'
      window.localStorage.setItem('piko.level.key1', undefined)
      window.localStorage.setItem('piko.level.key2', 'invent')
      const logger1 = Piko.logger(key1)
      const logger2 = Piko.logger(key2)

      expect(logger1._level._level).to.equal(DEFAULT_LEVEL)
      expect(logger2._level._level).to.equal(DEFAULT_LEVEL)
    })
    it('should create tagged loggers', () => {
      const baseKey = 'base'
      window.localStorage.setItem(`piko.level.${baseKey}`, 'debug')
      const base = Piko.logger(baseKey)
      const tagged = base.tag('tagged')
      const aDebugMessage = 'debug testing'
      tagged.debug(() => aDebugMessage)
      expect(debugSpy.args[0][0]).to.equal('DEBUG | base # tagged | ')
      expect(debugSpy.args[0][1]).to.equal(aDebugMessage)
    })
  })
})
