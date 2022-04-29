module.exports = {
  schema: {
    description: 'Get model\'s attachment files',
    tags: ['DB']
  },
  handler: async function (request, reply) {
    return await this.ndutApi.helper.getAttachment({ model: request.params.model, id: request.params.id })
  }
}
