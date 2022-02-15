const dbCall = require('./db-call')

const streaming = async function ({ input, model, params, filter }) {
  const { _, getNdutConfig } = this.ndut.helper
  const cfg = getNdutConfig('ndut-api')
  const batchSize = cfg.batchSize || 100
  let page = 1
  params.skip = 0
  params.limit = batchSize
  try {
    for (;;) {
      params.skip = (page - 1) * batchSize
      const data = await dbCall.call(this, { model, method: 'find', params, filter })
      if (data.length === 0) break
      data.forEach(input.write)
      page++
    }
    input.end()
  } catch (err) {
    input.destroy(err)
  }
}

module.exports = function ({ model, params, filter }) {
  const { JSONStream } = this.ndut.helper
  const input = JSONStream.stringify(false)
  streaming.call(this, { input, model, params, filter })
  return input
}
