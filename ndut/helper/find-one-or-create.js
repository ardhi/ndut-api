const findOne = require('./find-one')
const create = require('./create')

module.exports = async function ({ model, body, params, filter, options = {} }) {
  const { _ } = this.ndut.helper
  const opts = _.cloneDeep(options)
  opts.noThrow = true
  let data = await findOne.call(this, { model, params, filter, options: opts })
  if (!_.isEmpty(_.omit((data || {}).data, ['ndut']))) return data
  const result = await create.call(this, { model, body, filter, options })
  return result
}
