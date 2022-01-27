const dbCall = require('./db-call')

module.exports = async function ({ model, params, opts = {}, filter }) {
  const oldData = await dbCall.call(this, { model, method: 'findOne', params })
  if (!oldData) throw this.Boom.notFound('Record not found')
  await dbCall.call(this, { model, method: 'remove', params, filter })
  return {
    oldData,
    message: opts.message || 'Record successfully removed'
  }
}
