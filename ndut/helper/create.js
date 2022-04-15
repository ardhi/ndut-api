const dbCall = require('./db-call')
const uploadedAsAttachment = require('../../lib/uploaded-as-attachment')

module.exports = async function ({ model, body, filter, options = {} }) {
  const { _ } = this.ndut.helper
  const data = await dbCall.call(this, { model, method: 'create', body, filter, options })
  if (options.reqId) {
    const modelName = _.isString(model) ? model : model.name
    await uploadedAsAttachment.call(this, modelName, data.id, options.reqId)
  }
  return {
    data,
    message: options.message || 'recordCreated'
  }
}
