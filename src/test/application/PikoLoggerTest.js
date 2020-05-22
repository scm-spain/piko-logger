import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import sinon from 'sinon'
import {PikoLogger} from '../../main/application/PikoLogger'

describe('PikoLogger', () => {
  const dom = new JSDOM('<!DOCTYPE html><body></body>', {
    url: 'http://localhost'
  })
  global.window = dom.window
  global.document = dom.window.document

  describe('logger method', () => {
    let consoleDebug
    let consoleError
    let debugSpy
    let warnSpy

    before(() => {
      consoleDebug = console.log
      consoleError = console.error
      console.log = () => null
      console.error = () => null
      debugSpy = sinon.spy(console, 'log')
      warnSpy = sinon.spy(console, 'error')
    })

    after(() => {
      console.log = consoleDebug
      console.error = consoleError
    })

    beforeEach(() => {
      window.localStorage.clear()
      window.localStorage.setItem('piko.level', 'off')
      debugSpy.resetHistory()
      warnSpy.resetHistory()
    })

    it('should log debug and error level when initialized in localStorage with "debug"', () => {
      const loggerKey = 'test'
      window.localStorage.setItem(`piko.level.${loggerKey}`, 'debug')
      const aDebugMessage = 'debug testing'
      const aDebugMessage2 = 'debug testing 2'
      const anErrorMessage = 'error testing'

      const piko = new PikoLogger()
      const logger = piko.logger(loggerKey)
      logger.debug(() => aDebugMessage)
      logger.debug(() => aDebugMessage2)
      logger.error(() => anErrorMessage)

      expect(debugSpy.callCount).to.equal(2)
      expect(debugSpy.args[0][0]).to.equal('DEBUG | test | ')
      expect(debugSpy.args[0][1]).to.equal(aDebugMessage)
      expect(debugSpy.args[1][0]).to.equal('DEBUG | test | ')
      expect(debugSpy.args[1][1]).to.equal(aDebugMessage2)
      expect(warnSpy.callCount).to.equal(1)
      expect(warnSpy.args[0][0]).to.equal('ERROR | test | ')
      expect(warnSpy.args[0][1]).to.equal(anErrorMessage)
    })

    it('should log only error level when initialized in localStorage with "error"', () => {
      const loggerKey = 'test'
      window.localStorage.setItem(`piko.level.${loggerKey}`, 'error')
      const aDebugMessage = 'debug testing'
      const anErrorMessage = 'error testing'

      const piko = new PikoLogger()
      const logger = piko.logger(loggerKey)
      logger.debug(() => aDebugMessage)
      logger.error(() => anErrorMessage)

      expect(debugSpy.callCount).to.equal(0)
      expect(warnSpy.callCount).to.equal(1)
      expect(warnSpy.args[0][0]).to.equal('ERROR | test | ')
      expect(warnSpy.args[0][1]).to.equal(anErrorMessage)
    })

    it('should not log any level when initialized in localStorage with "off"', () => {
      const loggerKey = 'test'
      const aDebugMessage = 'debug testing'
      const anErrorMessage = 'error testing'

      const piko = new PikoLogger()
      const logger = piko.logger(loggerKey)
      logger.debug(() => aDebugMessage)
      logger.error(() => anErrorMessage)

      expect(debugSpy.callCount).to.equal(0)
      expect(warnSpy.callCount).to.equal(0)
    })

    it('should not log any level when not initialized in localStorage', () => {
      window.localStorage.clear()
      const loggerKey = 'test'
      const aDebugMessage = 'debug testing'
      const anErrorMessage = 'error testing'

      const piko = new PikoLogger()
      const logger = piko.logger(loggerKey)
      logger.debug(() => aDebugMessage)
      logger.error(() => anErrorMessage)

      expect(debugSpy.callCount).to.equal(0)
      expect(warnSpy.callCount).to.equal(0)
    })

    it('should log corresponding level for each initializated logger', () => {
      const loggerKey1 = 'test'
      const loggerKey2 = 'test2'
      window.localStorage.setItem(`piko.level.${loggerKey1}`, 'debug')
      window.localStorage.setItem(`piko.level.${loggerKey2}`, 'error')
      const aDebugMessage = 'debug testing'
      const aDebugMessage2 = 'debug testing 2'
      const anErrorMessage = 'error testing'
      const anErrorMessage2 = 'error testing 2'

      const piko = new PikoLogger()
      const logger1 = piko.logger(loggerKey1)
      logger1.debug(() => aDebugMessage)
      logger1.debug(() => aDebugMessage2)
      logger1.error(() => anErrorMessage)

      const logger2 = piko.logger(loggerKey2)
      logger2.debug(() => aDebugMessage)
      logger2.debug(() => aDebugMessage2)
      logger2.error(() => anErrorMessage)
      logger2.error(() => anErrorMessage2)

      expect(debugSpy.callCount).to.equal(2)
      expect(debugSpy.args[0][0]).to.equal('DEBUG | test | ')
      expect(debugSpy.args[0][1]).to.equal(aDebugMessage)
      expect(debugSpy.args[1][0]).to.equal('DEBUG | test | ')
      expect(debugSpy.args[1][1]).to.equal(aDebugMessage2)
      expect(warnSpy.callCount).to.equal(3)
      expect(warnSpy.args[0][0]).to.equal('ERROR | test | ')
      expect(warnSpy.args[0][1]).to.equal(anErrorMessage)
      expect(warnSpy.args[1][0]).to.equal('ERROR | test2 | ')
      expect(warnSpy.args[1][1]).to.equal(anErrorMessage)
      expect(warnSpy.args[2][0]).to.equal('ERROR | test2 | ')
      expect(warnSpy.args[2][1]).to.equal(anErrorMessage2)
    })
  })
})
