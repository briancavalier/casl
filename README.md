# Casl

Simple content addressable storage for localStorage. 

## API

### type Key = string
### type Storage = Object

### type Hash a = a -> Key

A Hash function generates keys for values to be stored.

### type Serialize a = a -> { key :: Key, content :: string, deserialize :: Deserialize a }

A Serialize function generates a key, content, and a deserializer function that can be used to deserialize the content back to its original form.

### data Store (Storage a) where

Conceptually, a Store contains a value of type a, and is backed by some sort of (possibly persistent) Storage.

### Functor
#### map :: (a -> b) -> Store a -> Store b

Map a Store focused on a to a Store focused on b.

### Extend
#### extract :: Store a -> a

Get a Store's value.

### Comonad
#### extend :: (Store a -> b) -> Store a -> Store b

Compute a new value to focus on, given the entire Store as context.

### localStore :: Hash a -> Storage a -> Key -> Store a

Create a Store focused on a particular value of type a at the provided Key.
