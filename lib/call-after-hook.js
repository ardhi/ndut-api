module.exports = async function ({ method, model, result = {}, oldResult = {}, params = {}, body = {}, options = {}, filter = {} }) {
  const { _ } = this.ndut.helper
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  let cResult = _.cloneDeep(result)
  this.ndutApi.hook = this.ndutApi.hook || {}
  for (const item of ['', '@' + modelInstance.name]) {
    const nmethod = method + item
    if (this.ndutApi.hook[nmethod]) {
      for (const obj of this.ndutApi.hook[nmethod]) {
        if (_.isFunction(obj.after)) {
          const resp = await obj.after({ method, model, result: cResult, oldResult, params, body, options, filter })
          if (resp) cResult = _.merge(cResult, resp)
        }
      }
    }
  }
  return cResult
}
