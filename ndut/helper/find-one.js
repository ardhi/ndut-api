const dbCall = require('./db-call')
const callBeforeHook = require('../../lib/call-before-hook')
const callAfterHook = require('../../lib/call-after-hook')

module.exports = async function ({ model, params, filter, options = {} }) {
  const { _ } = this.ndut.helper
  const method = 'findOne'
  if (!options.noBeforeHook) await callBeforeHook.call(this, { method, model, params, options, filter })
  let data = await dbCall.call(this, { model, method, params, filter, options })
  if (_.isEmpty(data)) {
    const mustThrow = !options.noThrow
    if (mustThrow) throw this.Boom.notFound('recordNotFound', { ndut: 'api' })
    return { data }
  }
  if (!options.noAfterHook) data = await callAfterHook.call(this, { method, model, result: data, params, options, filter })
  return {
    data
  }
}
