module.exports = async function ({ method, model, params = {}, body = {}, options = {}, filter = {} }) {
  const { _ } = this.ndut.helper
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  this.ndutApi.hook = this.ndutApi.hook || {}
  for (const item of ['', '@' + modelInstance.name]) {
    const nmethod = method + item
    if (this.ndutApi.hook[nmethod]) {
      for (const obj of this.ndutApi.hook[nmethod]) {
        if (_.isFunction(obj.before)) await obj.before({ method, model, params, body, options, filter })
      }
    }
  }
  if (filter.orWhere && filter.orWhere.length > 0) {
    params.where = { and: [{ or: filter.orWhere }, params.where] }
  }
}
