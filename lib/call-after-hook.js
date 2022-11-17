module.exports = async function ({ method, model, result = {}, oldResult = {}, params = {}, body = {}, options = {}, filter = {} }) {
  const { _ } = this.ndut.helper
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  let cResult = _.cloneDeep(result)
  const hook = _.get(this.ndutApi, 'hook.model', {})
  for (const item of ['', '@' + modelInstance.name]) {
    const nmethod = method + item
    if (hook[nmethod]) {
      for (const obj of hook[nmethod]) {
        if (_.isFunction(obj.after)) {
          const resp = await obj.after({ method, model, result: cResult, oldResult, params, body, options, filter })
          if (resp) cResult = _.merge(cResult, resp)
        }
      }
    }
  }
  const endpoint = _.get(options.request, 'context.config.name')
  if (endpoint) {
    const hook = _.get(this.ndutApi, 'hook.endpoint', {})
    for (const item of ['', '@' + endpoint]) {
      const nmethod = method + item
      if (hook[nmethod]) {
        for (const obj of hook[nmethod]) {
          if (_.isFunction(obj.after)) {
            const resp = await obj.after({ method, model, result: cResult, oldResult, params, body, options, filter })
            if (resp) cResult = _.merge(cResult, resp)
          }
        }
      }
    }
  }

  return cResult
}
