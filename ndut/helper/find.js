const dbCall = require('./db-call')

module.exports = async function ({ model, params, filter }) {
  const data = await dbCall.call(this, { model, method: 'find', params, filter })
  return {
    data,
    total: params.total,
    totalPage: Math.floor((params.total + params.limit - 1) / params.limit),
    pageSize: params.limit,
    page: params.page
  }
}
