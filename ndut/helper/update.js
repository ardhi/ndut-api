const dbCall = require('./db-call')

module.exports = async function (name, params, body, opts = {}) {
  const { getNdutConfig } = this.ndut.helper
  const oldData = await dbCall.call(this, name, 'findOne', { where: { id: params.id } })
  if (!oldData) throw this.Boom.notFound('Record not found')
  await dbCall.call(this, name, 'update', params, body)
  const data = await dbCall.call(this, name, 'findOne', { where: { id: params.id } })
  return {
    oldData,
    data,
    message: opts.message || 'Record successfully updated'
  }
}
