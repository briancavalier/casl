import { describe, it } from 'mocha'
import assert from 'assert'
import { jsonDeserializer, jsonSerializer } from '../src/index'

describe('jsonSerializer', () => {
  it('should return hash key and serialized content', () => {
    const hash = s => `test${s}`
    const data = { test: Math.random() }
    const serialize = jsonSerializer(hash)

    const { key, content, deserialize } = serialize(data)
    assert.strictEqual(key, hash(JSON.stringify(data)))
    assert.deepStrictEqual(data, deserialize(content))
  })
})

describe('jsonDeserializer', () => {
  it('should return undefined for null or undefined input', () => {
    assert.strictEqual(undefined, jsonDeserializer(null))
    assert.strictEqual(undefined, jsonDeserializer(undefined))
  })

  it('should return deserialized data for value input', () => {
    const data = { test: Math.random() }
    assert.deepStrictEqual(data, jsonDeserializer(JSON.stringify(data)))
  })
})
