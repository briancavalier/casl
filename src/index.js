/* global localStorage */

// Create a Store that holds values in the `storage` object
export const memoryStore = (hash, storage) => new Store(new JSONSerializer(hash), storage, '')

// Create a Store that holds values in localStorage
export const localStore = (hash) => new Store(new JSONSerializer(hash), localStorage, '')

// An immutable content-addressed store
// A Store contains an immutable value that is considered to be unique
// based on the provided serializer's key generation algorithm
export class Store {
  constructor (serializer, storage, key) {
    this.serializer = serializer
    this.storage = storage
    this.key = key
  }

  // Get the value out of this Store
  extract () {
    return this.serializer.deserialize(this.storage[this.key])
  }

  // Update the value in this store by mapping a function over it
  // Returns a Store containing the result
  map (f) {
    return this.set(f(this.serializer.deserialize(this.storage[this.key])))
  }

  // Return a store containing `data` as its value
  set (data) {
    const { key, content } = this.serializer.serialize(data)
    if (key === this.key) {
      return this // the content already exists, bail out
    }
    this.storage[key] = content
    return new Store(this.serializer, this.storage, key)
  }
}

export class JSONSerializer {
  constructor (hash) {
    this.hash = hash
  }

  serialize (data) {
    const json = JSON.stringify(data)
    return { key: this.hash(json), content: json }
  }

  deserialize (content) {
    return JSON.parse(content)
  }
}

