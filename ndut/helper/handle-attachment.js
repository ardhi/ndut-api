const path = require('path')

module.exports = async function ({ model, id, column, file, filter }) {
  const { fs, getConfig, getNdutConfig } = this.ndut.helper
  const { getModelByAlias } = this.ndutDb.helper
  const config = getConfig()
  const cfg = getNdutConfig('ndutApi')
  id = id.replace(/\//g, cfg.slashReplacer)
  const modelName = await getModelByAlias(model)
  const ref = `${modelName}/${id}/${column}/${file}`
  const fname = `${config.dir.data}/attachment/${ref}`
  if (!fs.existsSync(fname)) throw this.Boom.notFound()
  const stream = fs.createReadStream(fname)
  if (cfg.logDownload) {
    try {
      const { size } = fs.statSync(fname)
      const body = {
        refId: id,
        model,
        column,
        file,
        type: path.extname(fname).substr(1),
        size
      }
      await this.ndutApi.helper.create({ model: 'ApiLogAtt', body, filter })
    } catch (err) {}
  }

  return { file: fname, stream, ref }
}
