const dbCall = require('./db-call')

module.exports = async function (name, params, body, opts = {}) {
  const { getNdutConfig } = this.ndut.helper
  const data = await dbCall.call(this, name, 'findOne', params)
  if (!data) throw this.Boom.notFound('Record not found')
  return {
    data
  }
}
