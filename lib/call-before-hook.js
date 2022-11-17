module.exports = async function ({ method, model, params = {}, body = {}, options = {}, filter = {} }) {
  const { _ } = this.ndut.helper
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  // check for endpoints
  const endpoint = _.get(options.request, 'context.config.name')
  if (endpoint) {
    const hook = _.get(this.ndutApi, 'hook.endpoint', {})
    for (const item of ['', '@' + endpoint]) {
      const nmethod = method + item
      if (hook[nmethod]) {
        for (const obj of hook[nmethod]) {
          if (_.isFunction(obj.before)) await obj.before({ method, model, params, body, options, filter })
        }
      }
    }
  }
  const hook = _.get(this.ndutApi, 'hook.model', {})
  for (const item of ['', '@' + modelInstance.name]) {
    const nmethod = method + item
    if (hook[nmethod]) {
      for (const obj of hook[nmethod]) {
        if (_.isFunction(obj.before)) await obj.before({ method, model, params, body, options, filter })
      }
    }
  }
  if (filter.orWhere && filter.orWhere.length > 0) {
    params.where = { and: [{ or: filter.orWhere }, params.where] }
  }
}
