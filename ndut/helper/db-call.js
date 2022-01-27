module.exports = async function (name, method, params, body) {
  const { _ } = this.ndut.helper
  const model = _.isString(name) ? this.ndutDb.model[name] : name
  if (this.ndutApi.hook[method]) {
    for (const obj of this.ndutApi.hook[method]) {
      if (_.isFunction(obj.before)) args = _.merge(args, await obj.before(model, params, body))
    }
  }
  if (this.ndutApi.hook[method + '@' + model.name]) {
    for (const obj of this.ndutApi.hook[method + '@' + model.name]) {
      if (_.isFunction(obj.before)) args = _.merge(args, await obj.before(model, params, body))
    }
  }
  let result = await model[method](params, body)
  if (this.ndutApi.hook[method]) {
    for (const obj of this.ndutApi.hook[method]) {
      if (_.isFunction(obj.after)) {
        const resp = await obj.after(model, result, params, body)
        if (resp) result = _.merge(result, resp)
      }
    }
  }
  if (this.ndutApi.hook[method + '@' + model.name]) {
    for (const obj of this.ndutApi.hook[method + '@' + model.name]) {
      if (_.isFunction(obj.after)) {
        const resp = await obj.after(model, result, params, body)
        if (resp) result = _.merge(result, resp)
      }
    }
  }
  return result
}
