module.exports = function (data, columns) {
  const { _ } = this.ndut.helper
  const colKeys = _.map(_.keys(columns), k => {
    return { org: k, new: k.toLowerCase() }
  })
  return _.map(data, d => {
    const result = {}
    _.forOwn(d, (v, k) => {
      const key = _.find(colKeys, { new: k })
      if (key) result[key.org] = v
      else result[k] = v
    })
    return result
  })
}
