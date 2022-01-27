const dbCall = require('./db-call')

module.exports = async function (name, params, body, opts = {}) {
  return await dbCall.call(this, name, 'count', params)
}
