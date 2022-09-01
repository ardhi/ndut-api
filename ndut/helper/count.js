const callBeforeHook = require('../../lib/call-before-hook')
const dbCall = require('./db-call')

module.exports = async function ({ model, params, filter, options = {} }) {
  if (options.simpleFetch) options.noBeforeHook = true
  if (!options.noBeforeHook) await callBeforeHook.call(this, { method: 'find', model, params, options, filter })
  return await dbCall.call(this, { model, method: 'count', params, filter, options })
}
