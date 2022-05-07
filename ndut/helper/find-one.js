const dbCall = require('./db-call')
const callBeforeHook = require('../../lib/call-before-hook')
const callAfterHook = require('../../lib/call-after-hook')

module.exports = async function ({ model, params, filter, options = {} }) {
  const { _ } = this.ndut.helper
  const method = 'findOne'
  await callBeforeHook.call(this, { method, model, params, options, filter })
  let data = await dbCall.call(this, { model, method, params, filter, options })
  const mustThrow = !options.noThrow
  if (_.isEmpty(data) && mustThrow) throw this.Boom.notFound('recordNotFound', { ndut: 'api' })
  data = await callAfterHook.call(this, { method, model, result: data, params, options, filter })
  return {
    data
  }
}
