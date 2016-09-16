import { describe, it } from 'mocha'
import assert from 'assert'
import { emptyDeserializer, jsonSerializer } from '../src/index'

describe('emptySerializer', () => {
  it('should return undefined', () => {
    assert.strictEqual(undefined, emptyDeserializer({}))
  })
})

describe('jsonSerializer', () => {
  it('should return hash key and serialized content', () => {
    const hash = s => `test${s}`
    const data = { test: Math.random() }
    const serialize = jsonSerializer(hash)

    const { key, content, deserialize } = serialize(data)
    assert.strictEqual(key, hash(JSON.stringify(data)))
    assert.deepEqual(data, deserialize(content))
  })
})
