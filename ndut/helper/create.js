const dbCall = require('./db-call')
const callBeforeHook = require('../../lib/call-before-hook')
const callAfterHook = require('../../lib/call-after-hook')

module.exports = async function ({ model, body, filter, options = {} }) {
  const { _ } = this.ndut.helper
  const method = 'create'
  if (options.simpleFetch) options.noBeforeHook = true
  if (!options.noBeforeHook) await callBeforeHook.call(this, { method, model, body, options, filter })
  let data = await dbCall.call(this, { model, method, body, filter, options })
  if (options.simpleFetch) return data
  if (!options.noAfterHook) data = await callAfterHook.call(this, { method, model, result: data, body, options, filter })
  let uploadInfo = []
  if (!options.noUpload && options.reqId) {
    const modelName = _.isString(model) ? model : model.name
    uploadInfo = await this.ndutApi.helper.uploadedAsAttachment(modelName, data.id, options.reqId)
  }
  const result = {
    data,
    message: options.message || 'recordCreated'
  }
  if (options.uploadInfo) result.upload = uploadInfo
  return result
}
