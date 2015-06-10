var app = require(__dirname + '/../checkFreeSpace')
var async = require('async')
var jf = require('jsonfile')
var options = jf.readFileSync(__dirname + '/testScenarios.json')
var count = 0
var folderAmountRand = 20
var fileAmountRand = 10
var fileSizeRand = 10000000
var fs = require('fs')

var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

describe('Check Transaction from raw data', function () {
  this.timeout(0)
  before(function (done) {
    var m = Math.floor(Math.random() * folderAmountRand)
    var data = __dirname + '/data'
    var jump = false
    fs.mkdirSync(data)
    for (var i = 0; i < m; i++) {
      var n = Math.floor(Math.random() * fileAmountRand)
      if (Math.random() > 0.5) {
        data = data + '/data' + i
        jump = true
        fs.mkdirSync(data)
      }
      for (var j = 0; j < n; j++) {
        var size = Math.floor(Math.random() * (fileSizeRand - 1) + 1)
        fs.writeFileSync(data + '/' + j + '.tmp', new Buffer(size), 0, size - 1)
      }
      if (jump && Math.random() > 0.5) {
        data = data.slice(0, data.lastIndexOf('/data'))
        jump = false
      }
    }
    done()
  })

  it('should do something', function (done) {
    async.whilst(
      function () {
        return count < options.length
      },
      function (callback) {
        console.log('----------Test ' + (count + 1) + '----------')
        // if (options[count].pathToCheck === '__dirname')
        options[count].pathToCheck = __dirname + options[count].pathToCheck
        // console.log('Maximum allowed size: ' + options[count].maximumSize)
        app(options[count], function (err, result) {
          if (err) return callback(err)
          console.log('Room taken by path: ' + result.pathSize + ' MB')
          console.log('Maximum allowed size: ' + result.maximumSize + ' MB')
          if (result.amountToClear < 0) {
            console.log('Room Left: ' + (result.amountToClear * -1) + ' MB')
          } else {
            console.log('Space that needs to be clear: ' + result.amountToClear + ' MB')
          }
          count++
          callback(null)
        })
      },
      function (err) {
        console.log('--------------------------')
        if (err) return console.error(err)
        console.log('Finished with flying Colors')
        done()
      }
    )
  })

  after(function (done) {
    deleteFolderRecursive(__dirname + '/data')
  })
})
