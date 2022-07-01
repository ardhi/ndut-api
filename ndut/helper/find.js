const dbCall = require('./db-call')
const callBeforeHook = require('../../lib/call-before-hook')
const callAfterHook = require('../../lib/call-after-hook')

module.exports = async function ({ model, params = {}, filter = {}, options = {} }) {
  const method = 'find'
  if (!options.noBeforeHook) await callBeforeHook.call(this, { method, model, params, options, filter })
  let data = await dbCall.call(this, { model, method, params, filter, options })
  if (!options.noAfterHook) data = await callAfterHook.call(this, { method, model, result: data, params, options, filter })
  let result = {
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
