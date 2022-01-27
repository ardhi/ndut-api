const dbCall = require('./db-call')

module.exports = async function ({ model, params, body, opts = {}, filter }) {
  const oldData = await dbCall.call(this, { model, method: 'findOne', params })
  if (!oldData) throw this.Boom.notFound('Record not found')
  await dbCall.call(this, { model, method: 'update', params, body })
  const data = await dbCall.call(this, { model, method: 'findOne', params, filter })
  return {
    oldData,
    data,
    message: opts.message || 'Record successfully updated'
  }
}
