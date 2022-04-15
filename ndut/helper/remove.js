const dbCall = require('./db-call')

module.exports = async function ({ model, params, filter, options = {} }) {
  const { _, fs, getConfig } = this.ndut.helper
  const config = getConfig()
  const oldData = await dbCall.call(this, { model, method: 'findOne', params: { where: params }, options })
  if (!oldData) throw this.Boom.notFound('recordNotFound', { ndut: 'api' })
  await dbCall.call(this, { model, method: 'remove', params, filter, options })
  if (options.reqId) {
    const modelName = _.isString(model) ? model : model.name
    const dir = `${config.dir.data}/attachment/${modelName}/${oldData.id}`
    await fs.remove(dir)
  }
  return {
    oldData,
    message: options.message || 'recordRemoved'
  }
}
