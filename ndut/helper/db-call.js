module.exports = async function ({ model, method, params, body, filter, columns, options = {} }) {
  const { _ } = this.ndut.helper
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  const _method = method
  method = method === 'count' ? 'find' : method
  let result
  if (_method === 'create') {
    // HACK: if id is a string, result.id is autonumber (at least on SQLITE), so force it to use supplied id
    result = _.cloneDeep(await modelInstance.create(body))
    const idType = modelInstance.definition.properties.id.type
    if (typeof idType === 'function' && idType.name === 'String') {
      if (!_.isEmpty(body.id)) result.id = body.id
    }
  }
  else result = await modelInstance[_method](_method === 'count' ? (params.where || {}) : params, body)
  if (method === 'remove') console.log(params)
  if (_method === 'count') return result
  if (_.isEmpty(columns)) columns = _.keys(modelInstance.definition.properties)
  const columnsValue = _.isString(columns[0]) ? columns : _.map(columns, 'value')
  if (_.isArray(result)) result = _.map(result, r => _.pick(r, columnsValue))
  else result = _.pick(result, columnsValue)

  if (result && method !== 'count') result.ndut = 'api'
  return result
}
