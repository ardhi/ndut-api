const dbCall = require('./db-call')

module.exports = async function ({ model, params, filter }) {
  return await dbCall.call(this, { model, method: 'count', params, filter })
}
