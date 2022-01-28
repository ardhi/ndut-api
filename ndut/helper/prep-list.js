module.exports = async function (model, params = {}) {
  const { _, getNdutConfig } = this.ndut.helper
  const options = getNdutConfig('ndut-api')
  const { schemas } = this.ndutDb
  const { maxPageSize } = options
  if (!_.isString(model)) model = model.name
  let limit = parseInt(params.pageSize) || maxPageSize
  if (limit > maxPageSize) limit = maxPageSize
  if (limit < 1) limit = 1
  let page = parseInt(params.page) || 1
  if (page < 1) page = 1
  let skip = (page - 1) * limit
  if (params.offset) {
    skip = parseInt(params.offset) || skip
    page = undefined
  }
  if (skip < 0) skip = 0
  let where = {}
  if (params.query) {
    try {
      where = JSON.parse(params.query)
    } catch (err) {
      throw new Error(`Can't parse datasource query`)
    }
  }
  let order = params.sort
  if (!order) {
    const schema = _.find(schemas, { name: model }) || {}
    const keys = _.map(schema.columnns, 'name')
    const found = _.intersection(keys, ['updated_at', 'updatedAt', 'created_at', 'createdAt'])
    if (found[0]) order = `${found[0]} DESC`
  }
  return { limit, page, skip, order, where }
}
