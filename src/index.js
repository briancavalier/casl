// Create a Store
export const createStore = (hash, storage) =>
  new Store(hash, storage)

// Create a Store that holds values in localStorage
export const localStore = (hash, localStorage) =>
  createStore(hash, new LocalStorage(localStorage))

// A Store provides access to key-value storage, where
// values are stored based on a content-address provided
// by the supplied hash function
export class Store {
  constructor (hash, storage) {
    this.hash = hash
    this.storage = storage
  }

  valueForKey (key, defaultValue) {
    return new StoreValue(this.hash, this.storage, key)
      .map(a => a != null ? a : defaultValue)
  }
}

// An immutable content-addressed store
// A Store contains an immutable value that is considered to be unique
// based on the provided serializer's key generation algorithm
export class StoreValue {
  constructor (hash, storage, key) {
    this.hash = hash
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
    return this.storage.get(this.key)
  }
}

// Return a store containing `value` as its value
const update = (value, store) => {
  const key = store.hash(value)
  // If the key is already present, don't bother setting the
  // key/value pair again
  const newStorage = store.storage.has(key)
    ? store.storage : store.storage.set(key, value)

  return new StoreValue(store.hash, newStorage, key)
}

// LocalStorage Adapter
export class LocalStorage {
  constructor (localStorage) {
    this.localStorage = localStorage
  }

  has (key) {
    return this.localStorage.hasOwnProperty(key)
  }

  get (key) {
    const value = this.localStorage.getItem(key)
    return value == null ? value : JSON.parse(value)
  }

  set (key, value) {
    this.localStorage.setItem(key, JSON.stringify(value))
    return new LocalStorage(this.localStorage)
  }
}
