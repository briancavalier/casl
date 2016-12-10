import { describe, it } from 'mocha'
import assert from 'assert'
import { LocalStorage } from '../src/index'

describe('LocalStorage', () => {
  describe('has', () => {
    it('should return true when key present', () => {
      const s = new LocalStorage({})
      assert(!s.has('test'))
    })

    it('should return false when key not present', () => {
      const s = new LocalStorage({ test: '' })
      assert(s.has('test'))
    })
  })
})
