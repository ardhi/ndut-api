module.exports = async function ({ model, id, column, file }) {
  const { fs, getConfig, getNdutConfig } = this.ndut.helper
  const { getModelByAlias } = this.ndutDb.helper
  const config = getConfig()
  const cfg = getNdutConfig('ndutApi')
  id = id.replace(/\//g, cfg.slashReplacer)
  const modelName = await getModelByAlias(model)
  const fname = `${config.dir.data}/attachment/${modelName}/${id}/${column}/${file}`
  if (!fs.existsSync(fname)) throw this.Boom.notFound()
  const stream = fs.createReadStream(fname)
  return { file: fname, stream }
}
