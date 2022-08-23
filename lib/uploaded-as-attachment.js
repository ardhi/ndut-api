const path = require('path')

module.exports = async function (model, modelId, reqId) {
  const { fs, getConfig, fastGlob, getNdutConfig } = this.ndut.helper
  const config = getConfig()
  const cfg = getNdutConfig('ndutApi')
  modelId = modelId.replace(/\//g, cfg.slashReplacer)
  const source = `${config.dir.upload}/${reqId}/*`
  const files = await fastGlob(source)
  if (files.length === 0) return
  for (const f of files) {
    const [col, ...parts] = path.basename(f).split('-')
    if (parts.length === 0) continue
    let dir = `${config.dir.data}/attachment/${model}/${modelId}/${col}`
    console.log(f, dir)
    if (col.endsWith('[]')) dir = `${config.dir.data}/attachment/${model}/${modelId}/${col.replace('[]', '')}`
    else await fs.remove(dir)
    await fs.ensureDir(dir)
    const dest = `${dir}/${parts.join('-')}`
    await fs.copy(f, dest)
  }
}
