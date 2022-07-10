module.exports = async function (model, params = {}) {
  const { _, getNdutConfig } = this.ndut.helper
  const options = getNdutConfig('ndut-api')
  const { schemas } = this.ndutDb
  const { maxPageSize, defPageSize } = options
  if (!_.isString(model)) model = model.name
  let limit = parseInt(params.pageSize) || defPageSize
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
      throw new this.Boom.internal('cantParseDatasourceQuery', { ndut: 'api' })
    }
  }
  let order = params.sort
  if (!params.sort) {
    if (model === '_array_') {
      // TODO: array order
    } else {
      const schema = _.find(schemas, { name: model }) || {}
      const keys = _.keys(schema.properties)
      const found = _.intersection(['updated_at', 'updatedAt', 'created_at', 'createdAt'], keys)
      if (found[0]) order = `${found[0]} DESC`
    }
  } else if (_.isString(order)) {
    order = _.map(order.split(','), item => {
      const parts = _.map(_.trim(item).split(':'), i => _.trim(i))
      if (!parts[1]) parts[1] = 'ASC'
      parts[1] = parts[1].toUpperCase()
      if (!['ASC', 'DESC'].includes(parts[1])) parts[1] = 'ASC'
      return parts.join(' ')
    })
  }
  return { limit, page, skip, order, where }
}
