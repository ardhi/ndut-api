module.exports = async function ({ model, method, params, body, filter, columns, options = {} }) {
  const { _ } = this.ndut.helper
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  const _method = method
  const _params = _.cloneDeep(params)
  method = method === 'count' ? 'find' : method
  if (this.ndutApi.hook[method]) {
    for (const obj of this.ndutApi.hook[method]) {
      if (_.isFunction(obj.before)) await obj.before({ model, params: _params, body, filter })
    }
  }
  if (this.ndutApi.hook[method + '@' + modelInstance.name]) {
    for (const obj of this.ndutApi.hook[method + '@' + modelInstance.name]) {
      if (_.isFunction(obj.before)) await obj.before({ model, params: _params, body, filter })
    }
  }
  let result
  if (_method === 'create') {
    // TODO: if id is a string, result.id is autonumber ???????
    result = await modelInstance.create(body)
  }
  else result = await modelInstance[_method](_method === 'count' ? (_params.where || {}) : _params, body)
  if (_method === 'count') return result
  if (!_.isEmpty(columns)) {
    const columnsValue = _.map(columns, 'value')
    if (_.isArray(result)) result = _.map(result, r => _.pick(r, columnsValue))
    else result = _.pick(result, columnsValue)
  }
  if (this.ndutApi.hook[method]) {
    for (const obj of this.ndutApi.hook[method]) {
      if (_.isFunction(obj.after)) {
        const resp = await obj.after({ model, result, params: _params, body, options, filter })
        if (resp) result = _.merge(result, resp)
      }
    }
  }
  if (this.ndutApi.hook[method + '@' + modelInstance.name]) {
    for (const obj of this.ndutApi.hook[method + '@' + modelInstance.name]) {
      if (_.isFunction(obj.after)) {
        const resp = await obj.after({ model, result, params: _params, body, options, filter })
        if (resp) result = _.merge(result, resp)
      }
    }
  }
  if (result && method !== 'count') result.ndut = 'api'
  return result
}
