const path = require('path')

module.exports = async function (model, modelId, reqId) {
  const { fs, getConfig, fastGlob } = this.ndut.helper
  const config = getConfig()

  const source = `${config.dir.upload}/${reqId}/*`
  const files = await fastGlob(source)
  if (files.length === 0) return
  for (const f of files) {
    const [col, ...parts] = path.basename(f).split('-')
    if (parts.length === 0) continue
    let dir = `${config.dir.data}/attachment/${model}/${modelId}/${col}`
    if (col.endsWith('[]')) dir = `${config.dir.data}/attachment/${model}/${modelId}/${col.replace('[]', '')}`
    else await fs.remove(dir)
    await fs.ensureDir(dir)
    const dest = `${dir}/${parts.join('-')}`
    await fs.copy(f, dest)
  }
}
