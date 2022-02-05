const dbCall = require('./db-call')

module.exports = async function ({ model, params, body, opts = {}, filter }) {
  const data = await dbCall.call(this, { model, method: 'create', params, body, filter })
  return {
    data,
    message: opts.message || 'recordCreated'
  }
}
