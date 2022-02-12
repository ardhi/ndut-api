const dbCall = require('./db-call')

module.exports = async function ({ model, body, opts = {}, filter }) {
  const data = await dbCall.call(this, { model, method: 'create', body, filter })
  return {
    data,
    message: opts.message || 'recordCreated'
  }
}
