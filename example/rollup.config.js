import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'example/index.js',
  dest: 'example/app.js',
  format: 'iife',
  moduleName: 'caslExample',
  plugins: [
    buble(),
    resolve({ jsnext: true }),
    commonjs({
      include: 'node_modules/**',
    })
  ]
}
