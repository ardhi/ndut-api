const dbCall = require('./db-call')
const uploadedAsAttachment = require('../../lib/uploaded-as-attachment')
const callBeforeHook = require('../../lib/call-before-hook')
const callAfterHook = require('../../lib/call-after-hook')

module.exports = async function ({ model, body, filter, options = {} }) {
  const { _ } = this.ndut.helper
  const method = 'create'
  await callBeforeHook.call(this, { method, model, body, options, filter })
  let data = await dbCall.call(this, { model, method, body, filter, options })
  data = await callAfterHook.call(this, { method, model, result: data, body, options, filter })
  if (options.reqId) {
    const modelName = _.isString(model) ? model : model.name
    await uploadedAsAttachment.call(this, modelName, data.id, options.reqId)
  }
  return {
    data,
    message: options.message || 'recordCreated'
  }
}
