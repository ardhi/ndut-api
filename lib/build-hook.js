const path = require('path')

const methods = ['count', 'find', 'findOne', 'create', 'update', 'remove']

const build = async function (files, hook) {
  const { _, aneka } = this.ndut.helper
  const { pascalCase } = aneka
  for (const f of files) {
    const bases = path.basename(f, '.js').split('@')
    const type = path.dirname(f).split('/').pop()
    let mod = require(f)
    if (_.isFunction(mod)) mod = { before: mod.bind(this) }
    else {
      if (_.isFunction(mod.before)) mod.before = mod.before.bind(this)
      if (_.isFunction(mod.after)) mod.after = mod.after.bind(this)
    }
    if (bases[0] === 'all') bases[0] = _.map(methods, m => _.kebabCase(m)).join(',')
    _.each(bases[0].split(','), k => {
      k = _.camelCase(k)
      if (!methods.includes(k)) return
      _.each((bases[1] || '').split(','), m => {
        if (_.isEmpty(m)) {
          if (!hook[type][k]) hook[type][k] = []
          hook[type][k].push(mod)
        } else {
          const nk = k + '@' + (type === 'model' ? pascalCase(m) : m)
          if (!hook[type][nk]) hook[type][nk] = []
          hook[type][nk].push(mod)
        }
      })
    })
  }
}

module.exports = async function () {
  const { _, fastGlob, iterateNduts } = this.ndut.helper
  const hook = {}
  const bases = _.map(methods, m => _.kebabCase(m)).join(',')

  await iterateNduts(async function (cfg) {
    for (const i of ['model', 'endpoint']) {
      hook[i] = hook[i] || {}
      const files = await fastGlob(`${cfg.dir}/ndutApi/hook/${i}/{${bases},all}*.js`)
      build.call(this, files, hook)
    }
  })

  this.ndutApi.hook = hook
}
