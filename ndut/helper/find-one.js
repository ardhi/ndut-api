const dbCall = require('./db-call')

module.exports = async function ({ model, params, filter }) {
  const data = await dbCall.call(this, { model, method: 'findOne', params, filter })
  if (!data) throw this.Boom.notFound('Record not found')
  return {
    data
  }
}
