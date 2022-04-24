const dbCall = require('./db-call')
const callBeforeHook = require('../../lib/call-before-hook')
const callAfterHook = require('../../lib/call-after-hook')

module.exports = async function ({ model, params, filter, options = {} }) {
  const { _, fs, getConfig } = this.ndut.helper
  const config = getConfig()
  const method = 'remove'
  let oldData = await dbCall.call(this, { model, method: 'findOne', params: { where: params }, options })
  if (!oldData) throw this.Boom.notFound('recordNotFound', { ndut: 'api' })
  await callBeforeHook.call(this, { method, model, result: oldData, params, options, filter })
  await dbCall.call(this, { model, method, params, filter, options })
  oldData = await callAfterHook.call(this, { method, model, result: oldData, params, options, filter })
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
