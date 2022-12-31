module.exports = async function ({ model, method, params = {}, body = {}, filter = {}, options = {} }) {
  const { _ } = this.ndut.helper
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  const _method = method
  method = method === 'count' ? 'find' : method
  const _filter =  _.merge({}, filter, { body })
  let result
  if (_method === 'create') {
    // HACK: if id is a string, result.id is autonumber (at least on SQLITE), so force it to use supplied id
    const idType = _.get(modelInstance, 'definition.properties.id.type')
    const isStringId = typeof idType === 'function' && idType.name === 'String'
    let uniqueIdx = {}
    _.forOwn(modelInstance.settings.indexes, (v, k) => {
      if (_.get(v, 'options.unique')) {
        _.forOwn(v.keys, (v1, k1) => {
          if (v1 === 1 && !_.isEmpty(body[k1])) uniqueIdx[k1] = body[k1]
        })
      }
    })
    if (!_.isEmpty(uniqueIdx)) {
      const resp = await modelInstance.find({ where: uniqueIdx, limit: 1 })
      if (resp.length > 0) throw this.Boom.badData('recordExists', { ndut: 'api' })
    }
    if (isStringId && _.isEmpty(body.id)) {
      let cOpts = _.get(modelInstance, 'settings.feature.stringId')
      if (cOpts === true) cOpts = {}
      body.id = this.ndutDb.helper.generateId(cOpts)
    }
    result = _.cloneDeep(await modelInstance.create(body, _filter))
    if (isStringId) result.id = body.id
  } else if (_method === 'update') {
    delete body.__id
    const forceId = modelInstance.settings.forceId
    modelInstance.settings.forceId = false
    result = await modelInstance[_method](params, body, _filter)
    modelInstance.settings.forceId = forceId
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
