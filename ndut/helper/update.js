const dbCall = require('./db-call')
const uploadedAsAttachment = require('../../lib/uploaded-as-attachment')
const callBeforeHook = require('../../lib/call-before-hook')
const callAfterHook = require('../../lib/call-after-hook')

module.exports = async function ({ model, params, body, filter, options = {} }) {
  const { _ } = this.ndut.helper
  const method = 'update'
  const oldData = await dbCall.call(this, { model, method: 'findOne', params: { where: params }, filter, options })
  if (!oldData) throw this.Boom.notFound('recordNotFound', { ndut: 'api' })
  await callBeforeHook.call(this, { method, model, params, body, options, filter })
  await dbCall.call(this, { model, method, params, filter, body })
  let data = await dbCall.call(this, { model, method: 'findOne', params: { where: params }, filter, options })
  data = await callAfterHook.call(this, { method, model, result: data, params, body, options, filter })
  if (options.reqId) {
    const modelName = _.isString(model) ? model : model.name
    await uploadedAsAttachment.call(this, modelName, data.id, options.reqId)
  }
  return {
    oldData,
    data,
    message: options.message || 'recordUpdated'
  }
}
