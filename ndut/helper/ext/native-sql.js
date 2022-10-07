module.exports = function ({ model, params = {}, filter = {}, options = {}, stmt, stmtParams = [] }) {
  const { _ } = this.ndut.helper
  return new Promise((resolve, reject) => {
    const modelInstance = _.isString(model) ? this.ndutDb.model[model] : model
    const ds = modelInstance.getDataSource()
    ds.connector.execute(stmt, stmtParams, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}
