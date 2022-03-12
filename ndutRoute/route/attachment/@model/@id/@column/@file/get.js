module.exports = {
  handler: async function (request, reply) {
    const { fs, getConfig, mime } = this.ndut.helper
    const { getModelByAlias } = this.ndutDb.helper
    const config = getConfig()
    const model = await getModelByAlias(request.params.model)
    request.silentOnError = true // TODO: put on config and attach on preHandler
    if (!request.user) throw this.Boom.unauthorized()
    const file = `${config.dir.data}/attachment/${model}/${request.params.id}` +
      `/${request.params.column}/${request.params.file}`
    if (!fs.existsSync(file)) throw this.Boom.notFound()
    if (request.query.inline) reply.header('Content-Type', mime.getType(file))
    const stream = fs.createReadStream(file)
    reply.send(stream)
  }
}
