const dbCall = require('./db-call')

module.exports = async function ({ model, params, filter }) {
  const data = await dbCall.call(this, { model, method: 'find', params, filter })
  const result = {
    data,
    pageSize: params.limit,
    page: params.page
  }
  if (!params.noCount) {
    result.total = params.total
    result.totalPages = Math.floor((params.total + params.limit - 1) / params.limit)
  }
  return result
}
