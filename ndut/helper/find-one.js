const dbCall = require('./db-call')

module.exports = async function ({ model, params, filter, options = {} }) {
  const data = await dbCall.call(this, { model, method: 'findOne', params, filter, options })
  const mustThrow = !options.noThrow
  if (!data && mustThrow) throw this.Boom.notFound('recordNotFound', { ndut: 'api' })
  return {
    data
  }
}
