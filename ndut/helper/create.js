const dbCall = require('./db-call')

module.exports = async function (name, params, body, opts = {}) {
  const { getNdutConfig } = this.ndut.helper
  const data = await dbCall.call(this, name, 'create', params, body)
  return {
    data,
    message: opts.message || 'Record successfully created'
  }
}
