// Create a Store that holds values in localStorage
// The the returned store will have the value addressed by the provided key
export const localStore = (hash, localStorage, key) =>
  new Store(jsonSerializer(hash), jsonDeserializer, localStorage, key)

export const jsonDeserializer = json =>
  json == null ? undefined : JSON.parse(json)

export const jsonSerializer = hash => data => {
  const json = JSON.stringify(data)
  return { key: hash(json), content: json, deserialize: jsonDeserializer }
}

// An immutable content-addressed store
// A Store contains an immutable value that is considered to be unique
// based on the provided serializer's key generation algorithm
export class Store {
  constructor (serialize, deserialize, storage, key) {
    this.serialize = serialize
    this.deserialize = deserialize
    this.storage = storage
    this.key = key
  }

  // Get the value out of this Store
  extract () {
    return this.deserialize(this.storage[this.key])
  }

  // Update the value in this store by mapping a function over it
  // Returns a Store containing the result
  map (f) {
    return this.set(f(this.extract()))
  }

  // Return a store containing `data` as its value
  set (data) {
    const { key, content, deserialize } = this.serialize(data)
    if (key === this.key) {
      return this // the content already exists, bail out
    }
    this.storage[key] = content
    return new Store(this.serialize, deserialize, this.storage, key)
  }
}
