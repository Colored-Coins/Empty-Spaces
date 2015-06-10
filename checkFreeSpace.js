var getSize = require('get-folder-size')
var async = require('async')
var diskspace = require('diskspace')

module.exports = function (opt, cb) {
  if (!opt.pathToCheck) return cb(new Error('Missing Param: pathToCheck'))
  if (!opt.maximumSize) return cb(new Error('Missing Params: maximumSize'))

  var pathToCheck = opt.pathToCheck
  var maximumSize = opt.maximumSize
  var retryTime = opt.retryTime
  var pathSize

  async.waterfall([
    function (callback) {
      getSize(pathToCheck, callback)
    },
    function (size, callback) {
      pathSize = size
      pathSize = (pathSize / 1024 / 1024).toFixed(2)

      if (typeof maximumSize === 'string' && maximumSize.indexOf('%') > -1) {
        var keepTrying = function (err, total, free, status) {
          if (err) return callback(err)
          if (status === 'NOTREADY') {
            if (retryTime && retryTime > 0) {
              console.log('The drive isn\'t ready, trying again in ' + retryTime + 'seconds')

              setTimeout(function () {
                diskspace.check(pathToCheck, keepTrying)
              }, retryTime)
            } else {
              return callback(new Error(status))
            }
          }
          callback(err, total, free, status)
        }

        diskspace.check(pathToCheck, keepTrying)
      } else {
        callback(null, 0, 0, 'NOTPRECENT')
      }
    }
  ], function (err, total, free, status) {
    if (err) return cb(err)
    // NOTFOUND - Disk was not found, the space values will be 0
    // READY - The drive is ready
    // NOTREADY - The drive isn't ready, the space values will be 0
    // STDERR - some error, the output of it was logged to the console.
    // NOTPRECENT - The maximumSize is already in absolute size
    switch (status) {
      case 'READY':
          free = (free / 1024 / 1024).toFixed(2)
          maximumSize = maximumSize.split('%')[0] / 100
          maximumSize = (maximumSize * free).toFixed(2)
          break
      case 'NOTPRECENT':
          break
      default:
        return cb(new Error(status))
    }
    var amountToClear = (pathSize - maximumSize).toFixed(2)

    cb(null, {
      pathSize: pathSize,
      maximumSize: maximumSize,
      amountToClear: amountToClear
    })
  })
}
