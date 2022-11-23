module.exports = {
  handler: async function (request, reply) {
    const { mime } = this.ndut.helper
    request.silentOnError = true // TODO: put on config and attach on preHandler
    const filter = this.ndutRoute.helper.buildFilter(request)
    const { file, stream } = await this.ndutApi.helper.handleAttachment({
      model: request.params.model,
      id: request.params.id,
      column: request.params.column,
      file: request.params.file,
      filter
    })
    if (request.query.inline) reply.header('Content-Type', mime.getType(file))
    reply.send(stream)
  }
}
