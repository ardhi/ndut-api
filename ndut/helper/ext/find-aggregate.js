// const dbCall = require('./db-call')
const callBeforeHook = require('../../../lib/call-before-hook')
const callAfterHook = require('../../../lib/call-after-hook')

module.exports = async function ({ model, params = {}, filter = {}, options = {} }) {
  const { _, aneka } = this.ndut.helper
  const method = 'find'
  if (options.simpleFetch) options.noBeforeHook = true
  if (!options.noBeforeHook) await callBeforeHook.call(this, { method, model, params, options, filter })
  const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
  const columns = modelInstance.definition.properties
  const cols = _.map(params.agg.split(','), c => _.trim(c))
  _.forOwn(cols, c => {
    if (!_.keys(columns).includes(c)) throw this.Boom.badData('invalidAggColumn', { ndut: 'api' })
  })
  const con = modelInstance.getConnector()
  let agg = ['count', '*']
  if (params.fn) agg = params.fn.split(':')
  if (!agg[1]) agg[1] = '*'
  const select = con.buildSelect(model, params)
  const parts = select.sql.split(' FROM ')
  const groupby1 = `${cols.join(', ')}`
  parts[0] = `SELECT ${groupby1}, ${agg[0]}(${agg[1]}) as agg`
  const parts1 = parts[1].split(' ORDER BY ')
  parts1[0] += ` GROUP BY ${cols.join(', ')} ` // TODO: add 'having'
  if (params.having) {
    const having = con.buildWhere(model, params.having)
    parts1[0] += having.sql.replace('WHERE', 'HAVING') + ' '
    select.params = _.concat(select.params, having.params)
  }
  parts[1] = parts1.join(' ORDER BY ')
  const stmt = parts.join(' FROM ').split(' LIMIT ')[0]
  let data = await this.ndutApi.helper.extNativeSql({ stmt, stmtParams: select.params, model })
  data = Object.values(JSON.parse(JSON.stringify(data)))
  // ALWAYS noCount here
  if (options.simpleFetch) return data
  if (!options.noAfterHook) data = await callAfterHook.call(this, { method, model, result: data, params, options, filter })
  const result = aneka.paginate(data, params.page, params.limit)
  result.data = result.rows
  return _.omit(result, ['rows'])
}
