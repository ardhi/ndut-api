const dbCall = require('./db-call')
const callBeforeHook = require('../../lib/call-before-hook')
const callAfterHook = require('../../lib/call-after-hook')

module.exports = async function ({ model, params, body, filter, options = {} }) {
  const { _ } = this.ndut.helper
  const method = 'update'
  if (options.simpleFetch) options.noBeforeHook = true
  const oldData = await dbCall.call(this, { model, method: 'findOne', params: { where: params }, filter, options: { simpleFetch: true } })
  if (!oldData) throw this.Boom.notFound('recordNotFound', { ndut: 'api' })
  if (!options.noBeforeHook) await callBeforeHook.call(this, { method, model, result: oldData, params, body, options, filter })
  await dbCall.call(this, { model, method, params, filter, body, options })
  let data = await dbCall.call(this, { model, method: 'findOne', params: { where: params }, filter, options })
  if (options.simpleFetch) return data
  if (!options.noAftereHook) data = await callAfterHook.call(this, { method, model, result: data, oldResult: oldData, params, body, options, filter })
  let uploadInfo = []
  if (!options.noUpload && options.reqId) {
    const modelName = _.isString(model) ? model : model.name
    uploadInfo = await this.ndutApi.helper.uploadedAsAttachment(modelName, data.id, options.reqId)
  }
  const result = {
    oldData,
    data,
    message: options.message || 'recordUpdated'
  }
  if (options.uploadInfo) result.upload = uploadInfo
  return result
}
