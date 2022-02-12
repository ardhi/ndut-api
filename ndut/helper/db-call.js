module.exports = async function ({ model, method, params, body, opts, filter }) {
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
  if (_method === 'create') result = await modelInstance.create(body)
  else result = await modelInstance[_method](_method === 'count' ? (_params.where || {}) : _params, body)
  if (_method === 'count') return result
  if (this.ndutApi.hook[method]) {
    for (const obj of this.ndutApi.hook[method]) {
      if (_.isFunction(obj.after)) {
        const resp = await obj.after({ model, result, params: _params, body, opts, filter })
        if (resp) result = _.merge(result, resp)
      }
    }
  }
  if (this.ndutApi.hook[method + '@' + modelInstance.name]) {
    for (const obj of this.ndutApi.hook[method + '@' + modelInstance.name]) {
      if (_.isFunction(obj.after)) {
        const resp = await obj.after({ model, result, params: _params, body, opts, filter })
        if (resp) result = _.merge(result, resp)
      }
    }
  }
  if (result && method !== 'count') result.ndut = 'api'
  return result
}
