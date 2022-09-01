const findOne = require('./find-one')
const create = require('./create')
const update = require('./update')

module.exports = async function ({ model, params, body, filter, options = {} }) {
  const { _ } = this.ndut.helper
  if (options.simpleFetch) options.noBeforeHook = true
  let data = await findOne.call(this, { model, params: { where: params }, filter, options: { simpleFetch: true } })
  if (_.isEmpty(data)) {
    const created = await create.call(this, { model, body, filter, options })
    return created
  }
  const updated = await update.call(this, { model, params, body, filter, options })
  return updated
}
