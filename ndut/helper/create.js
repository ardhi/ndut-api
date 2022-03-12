const dbCall = require('./db-call')
const uploadedAsAttachment = require('../../lib/uploaded-as-attachment')

module.exports = async function ({ model, body, opts = {}, filter }) {
  const { _ } = this.ndut.helper
  const data = await dbCall.call(this, { model, method: 'create', body, filter })
  if (opts.reqId) {
    const modelName = _.isString(model) ? model : model.name
    await uploadedAsAttachment.call(this, modelName, data.id, opts.reqId)
  }
  return {
    data,
    message: opts.message || 'recordCreated'
  }
}
