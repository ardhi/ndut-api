module.exports = async function ({ model, method, params = {}, body = {}, filter = {}, options = {} }) {
  const { _ } = this.ndut.helper
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  const _method = method
  method = method === 'count' ? 'find' : method
  const _filter =  _.merge({}, filter, { body })
  let result
  if (_method === 'create') {
    // HACK: if id is a string, result.id is autonumber (at least on SQLITE), so force it to use supplied id
    result = _.cloneDeep(await modelInstance.create(body, _filter))
    const idType = modelInstance.definition.properties.id.type
    if (typeof idType === 'function' && idType.name === 'String') {
      /*
      if (_.isEmpty(body.id)) {
        let cOpts = _.get(modelInstance, 'settings.feature.stringId')
        if (cOpts === true) cOpts = {}
        body.id = this.ndutDb.helper.generateId(cOpts)
      }
      */
      result.id = body.id
    }
  } else if (_method === 'update') {
    result = await modelInstance[_method](params, body, _filter)
  } else result = await modelInstance[_method](_method === 'count' ? (params.where || {}) : params, _filter)
  if (_method === 'count') return result
  let columns = options.columns || []
  if (_.isEmpty(columns)) columns = _.keys(modelInstance.definition.properties)
  let columnsValue = _.isString(columns[0]) ? columns : _.map(columns, 'value')
  let omitted = options.omittedColumns || []
  if (!_.isEmpty(omitted)) {
    omitted = _.isString(omitted[0]) ? omitted : _.map(omitted, 'value')
    columnsValue = _.without(columnsValue, ...omitted)
  }
  if (_.isArray(result)) result = _.map(result, r => _.pick(r, columnsValue))
  else result = _.pick(result, columnsValue)
  return result
}
