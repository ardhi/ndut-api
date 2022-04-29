module.exports = async function ({ model, id }) {
  const { _, fastGlob, getConfig } = this.ndut.helper
  const { getModelByAlias } = this.ndutDb.helper
  const config = getConfig()
  const modelName = await getModelByAlias(model)
  const dir = `${config.dir.data}/attachment/${modelName}/${id}`
  const files = await fastGlob(`${dir}/**/*`)
  const data = {}
  for (const f of files) {
    const [empty, column, file] = f.replace(dir, '').split('/')
    if (!data[column]) data[column] = []
    data[column].push(file)
  }
  _.forOwn(data, (v, k) => {
    if (v.length === 1) data[k] = v[0]
  })
  return { data }
}
