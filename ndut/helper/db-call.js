module.exports = async function ({ model, method, params, body, opts, filter }) {
  const { _ } = this.ndut.helper
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  const _method = method
  method = method === 'count' ? 'find' : method
  if (this.ndutApi.hook[method]) {
    for (const obj of this.ndutApi.hook[method]) {
      if (_.isFunction(obj.before)) await obj.before({ model, params, body, filter })
    }
  }
  if (this.ndutApi.hook[method + '@' + modelInstance.name]) {
    for (const obj of this.ndutApi.hook[method + '@' + modelInstance.name]) {
      if (_.isFunction(obj.before)) await obj.before({ model, params, body, filter })
    }
  }
  let result = await modelInstance[_method](params, body)
  if (_method === 'count') return result
  if (this.ndutApi.hook[method]) {
    for (const obj of this.ndutApi.hook[method]) {
      if (_.isFunction(obj.after)) {
        const resp = await obj.after({ model, result, params, body, opts, filter })
        if (resp) result = _.merge(result, resp)
      }
    }
  }
  if (this.ndutApi.hook[method + '@' + modelInstance.name]) {
    for (const obj of this.ndutApi.hook[method + '@' + modelInstance.name]) {
      if (_.isFunction(obj.after)) {
        const resp = await obj.after({ model, result, params, body, opts, filter })
        if (resp) result = _.merge(result, resp)
      }
    }
  }
  if (result && method !== 'count') result.ndut = 'api'
  return result
}
