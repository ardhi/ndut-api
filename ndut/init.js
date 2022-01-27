const buildHook = require('../lib/build-hook')

module.exports = async function (options) {
  this.ndutApi.hook = {}
  await buildHook.call(this)
}
