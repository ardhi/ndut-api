const dbCall = require('./db-call')

module.exports = async function (name, params, body, opts = {}) {
  const { getNdutConfig } = this.ndut.helper
  const data = await dbCall.call(this, name, 'find', params)
  return {
    data,
    total: params.total,
    totalPage: Math.floor((params.total + params.limit - 1) / params.limit),
    pageSize: params.limit,
    page: params.page
  }
}
