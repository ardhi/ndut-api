module.exports = async function ({ method, model, result = {}, params = {}, body = {}, options = {}, filter = {} }) {
  const { _ } = this.ndut.helper
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  let cResult = _.cloneDeep(result)
  this.ndutApi.hook = this.ndutApi.hook || {}
  if (this.ndutApi.hook[method]) {
    for (const obj of this.ndutApi.hook[method]) {
      if (_.isFunction(obj.after)) {
        const resp = await obj.after({ model, result: cResult, params, body, options, filter })
        if (resp) cResult = _.merge(cResult, resp)
      }
    }
  }
  if (this.ndutApi.hook[method + '@' + modelInstance.name]) {
    for (const obj of this.ndutApi.hook[method + '@' + modelInstance.name]) {
      if (_.isFunction(obj.after)) {
        const resp = await obj.after({ model, result: cResult, params, body, options, filter })
        if (resp) cResult = _.merge(cResult, resp)
      }
    }
  }
  return cResult
}
