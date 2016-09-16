import { describe, it } from 'mocha'
import assert from 'assert'
import { JSONSerializer } from '../src/index'

describe('JSONSerializer', () => {
  describe('serialize', () => {
    it('should return hash key and seriaized content', () => {
      const hash = s => `test${s}`
      const data = { test: Math.random() }
      const s = new JSONSerializer(hash)

      const { key, content } = s.serialize(data)
      assert.strictEqual(key, hash(JSON.stringify(data)))
      assert.deepEqual(data, JSON.parse(content))
    })
  })
})
