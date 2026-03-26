import * as path from 'path'

// Hack the react scaffolding to be able to load client (path relative to this file — no self package name)
export default (filepath: string) => path.resolve(__dirname, 'client', filepath)
