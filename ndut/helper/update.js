const dbCall = require('./db-call')
const uploadedAsAttachment = require('../../lib/uploaded-as-attachment')

module.exports = async function ({ model, params, body, filter, options = {} }) {
  const { _ } = this.ndut.helper
  const oldData = await dbCall.call(this, { model, method: 'findOne', params: { where: params }, filter, options })
  if (!oldData) throw this.Boom.notFound('recordNotFound', { ndut: 'api' } )
  await dbCall.call(this, { model, method: 'update', params, filter, body })
  const data = await dbCall.call(this, { model, method: 'findOne', params: { where: params }, filter, options })
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
