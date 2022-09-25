const path = require('path')

module.exports = async function (model, modelId = '', reqId) {
  const { fs, getConfig, fastGlob, getNdutConfig } = this.ndut.helper
  const config = getConfig()
  const cfg = getNdutConfig('ndutApi')
  modelId = modelId.replace(/\//g, cfg.slashReplacer)
  const source = `${config.dir.upload}/${reqId}/*`
  const files = await fastGlob(source)
  const result = []
  if (files.length === 0) return result
  for (const f of files) {
    const [col, ...parts] = path.basename(f).split('-')
    if (parts.length === 0) continue
    let dir = `${config.dir.data}/attachment/${model}/${modelId}/${col}`
    if (col.endsWith('[]')) dir = `${config.dir.data}/attachment/${model}/${modelId}/${col.replace('[]', '')}`
    else await fs.remove(dir)
    await fs.ensureDir(dir)
    const file = parts.join('-')
    const dest = `${dir}/${file}`
    await fs.copy(f, dest)
    result.push({ dir, file })
  }
  return result
}
