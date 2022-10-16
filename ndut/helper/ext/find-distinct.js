// const dbCall = require('./db-call')
const callBeforeHook = require('../../../lib/call-before-hook')
const callAfterHook = require('../../../lib/call-after-hook')

module.exports = async function ({ model, params = {}, filter = {}, options = {} }) {
  const { _ } = this.ndut.helper
  const method = 'find'
  if (options.simpleFetch) options.noBeforeHook = true
  if (!options.noBeforeHook) await callBeforeHook.call(this, { method, model, params, options, filter })
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  const columns = modelInstance.definition.properties
  const cols = _.map(params.distinct.split(','), c => _.trim(c))
  _.forOwn(cols, c => {
    if (!_.keys(columns).includes(c)) throw this.Boom.badData('invalidDisinctColumn', { ndut: 'ndutApi' })
  })
  const con = modelInstance.getConnector()
  if (cols.length === 0) throw this.Boom.badData('invalidDisinctColumn', { ndut: 'ndutApi' })
  const select = con.buildSelect(model, params)
  const parts = select.sql.split(' FROM ')
  const distinct = `DISTINCT ${cols.join(', ')}`
  parts[0] = `SELECT ${distinct}`
  let data = await this.ndutApi.helper.extNativeSql({ stmt: parts.join(' FROM '), stmtParams: select.params, model })
  data = data.map(function(obj) {
    return con.fromRow(model, obj);
  })
  if (!params.noCount) {
    parts[0] = `SELECT COUNT(${distinct}) AS CNT`
    const total = await this.ndutApi.helper.extNativeSql({ stmt: parts.join(' FROM '), stmtParams: select.params, model })
    params.total = total[0].CNT
  }
  if (options.simpleFetch) return data
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
