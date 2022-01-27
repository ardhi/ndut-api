const path = require('path')

const methods = ['count', 'find', 'findOne', 'create', 'update', 'remove']

const build = async function (files, hook) {
  const { _, aneka } = this.ndut.helper
  const { pascalCase } = aneka
  for (const f of files) {
    const bases = path.basename(f, '.js').split('@')
    let key = _.camelCase(bases[0])
    if (!methods.includes(key)) continue
    if (bases[1]) key += '@' + pascalCase(bases[1])
    let mod = require(f)
    if (_.isFunction(mod)) mod = { before: mod.bind(this) }
    else {
      if (_.isFunction(mod.before)) mod.before = mod.before.bind(this)
      if (_.isFunction(mod.after)) mod.after = mod.after.bind(this)
    }

    if (!hook[key]) hook[key] = []
    hook[key].push(mod)
  }
}

module.exports = async function () {
  const { _, fastGlob, getConfig, getNdutConfig } = this.ndut.helper
  const config = await getConfig()
  const hook = {}
  const bases = _.map(methods, m => _.snakeCase(m)).join(',')

  for (let n of config.nduts) {
    n = await getNdutConfig(n)
    const files = await fastGlob(`${n.dir}/ndutApi/hook/{${bases}}*.js`)
    build.call(this, files, hook)
  }

  this.ndutApi.hook = hook
}
