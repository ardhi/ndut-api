module.exports = async function ({ method, model, params = {}, body = {}, options = {}, filter = {} }) {
  const { _ } = this.ndut.helper
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  // const _params = _.cloneDeep(params)
  this.ndutApi.hook = this.ndutApi.hook || {}
  if (this.ndutApi.hook[method]) {
    for (const obj of this.ndutApi.hook[method]) {
      if (_.isFunction(obj.before)) await obj.before({ model, params, body, filter, options })
    }
  }
  if (this.ndutApi.hook[method + '@' + modelInstance.name]) {
    for (const obj of this.ndutApi.hook[method + '@' + modelInstance.name]) {
      if (_.isFunction(obj.before)) await obj.before({ model, params, body, filter, options })
    }
  }
}
