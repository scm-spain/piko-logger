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
  })
})
