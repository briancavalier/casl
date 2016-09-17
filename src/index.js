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

  // Functor - map the Store's value
  map (f) {
    return update(f(this.extract()), this)
  }

  // Extend - extend a function into the Store
  extend (f) {
    return update(f(this), this)
  }

  // Comonad - extract value from this Store
  extract () {
    return this.deserialize(this.storage[this.key])
  }
}

// Return a store containing `data` as its value
const update = (data, store) => {
  const { key, content, deserialize } = store.serialize(data)
  if (key === store.key) {
    return store // the content already exists, bail out
  }
  store.storage[key] = content
  return new Store(store.serialize, deserialize, store.storage, key)
}
