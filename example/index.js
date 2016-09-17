import { localStore } from '../src/index'
import md5 from 'md5'
import snabbdom from 'snabbdom'
import events from 'snabbdom/modules/eventlisteners'
import attrs from 'snabbdom/modules/attributes'
import props from 'snabbdom/modules/props'
import h from 'snabbdom/h'

// Helpers
const pipe = (f, ...fs) => fs.reduce(pipe2, f)
const pipe2 = (f, g) => x => g(f(x))
const scan = (f, a) => b => (a = f(a, b))

// Init DOM container and snabbdom
const container = document.getElementById('app')
const patch = snabbdom.init([events, attrs, props])

// Create and init a Store based on the current has
const key = location.hash.slice(1)
let store = localStore(md5, localStorage, key).map(x => x || [])

// VDom rendering / patching
const render = submit => lines =>
  h('div#app', [
    h('form', { on: { submit } }, [
      h('input', { attrs: { name: 'line', autofocus: true, value: '' } }),
      h('button', 'Add')
    ]),
    h('ol', lines.map(line => h('li', line)))
  ])

const renderLines = render(e => submit(e))
const patchLines = scan(patch, patch(container, renderLines(store.extract())))
const update = pipe(renderLines, patchLines)

// Submit handling
// When adding a new item, map the store to append the new value
const lineValue = e => {
  const line = e.target.elements.line.value
  e.preventDefault()
  e.target.reset()
  return line
}

const addLine = line => {
  store = store.map(lines => lines.concat([line]))
  location.hash = store.key
  return store.extract()
}

const submit = pipe(lineValue, addLine, update)

// Hashchange handling
// When the hash changes, focus the store on the new hash
const keyValue = e => location.hash.slice(1)
const loadKey = key => {
  store = store.extend(({ deserialize, storage }) => deserialize(storage[key]) || [])
  return store.extract()
}

const hashChange = pipe(keyValue, loadKey, update)

window.addEventListener('hashchange', hashChange, false)
