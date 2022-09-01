const findOne = require('./find-one')
const create = require('./create')

module.exports = async function ({ model, body, params, filter, options = {} }) {
  const { _ } = this.ndut.helper
  if (options.simpleFetch) options.noBeforeHook = true
  let data = await findOne.call(this, { model, params, filter, options: { simpleFetch: true } })
  if (!_.isEmpty(data)) return data
  const result = await create.call(this, { model, body, filter, options })
  return result
}
