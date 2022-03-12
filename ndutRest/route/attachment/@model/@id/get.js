module.exports = {
  schema: {
    description: 'Get model\'s attachment files',
    tags: ['DB']
  },
  handler: async function (request, reply) {
    const { _, fastGlob, getConfig } = this.ndut.helper
    const { getModelByAlias } = this.ndutDb.helper
    const config = getConfig()
    const model = await getModelByAlias(request.params.model)
    const dir = `${config.dir.data}/attachment/${model}/${request.params.id}`
    const files = await fastGlob(`${dir}/**/*`)
    const data = {}
    for (const f of files) {
      const [empty, column, file] = f.replace(dir, '').split('/')
      if (column.endsWith('Multi')) {
        if (!data[column]) data[column] = []
        data[column].push(file)
      } else data[column] = file
    }
    return data
  }
}
