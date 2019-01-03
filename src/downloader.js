const fs = require('fs')
const request = require('request')

import uploadFile from './uploader.js'

function downloadFile(workerData) {
  return new Promise(function (resolve, reject) {

    let filepath = workerData.title.split('/').join('-') + '.mp3'
    let title = filepath.replace("@", "at")

    if (fs.existsSync('./tmp/' + title)) {
      fs.unlink('./tmp/' + title, (err) => {
        if (err) {
          reject({
            error: 'removingfile',
            url: workerData.url
          })
        }
      })
    }
    console.log("Downloading: ", workerData.url)
    const options = {
      followAllRedirects: true,
      url: workerData.url,
      headers: {
        'crossdomain': true,
      }
    }
    const req = request
      .get(options)
      .on('response', function (response) {
        if (response.statusCode !== 200) {
          reject({
            error: "Did not get a 200",
            url: workerData.url
          })
        } else {
          const pipe = req.pipe(fs.createWriteStream('./tmp/' + title))
          pipe.on('error', function (err) {
            fs.unlink('./tmp/' + title, (err) => {
              if (err) {
                reject({
                  error: 'removingfile',
                  url: workerData.url
                })
                return
              }
              resolve({
                error: false,
                url: workerData.url
              })
            })
            reject({
              error: err,
              url: workerData.url
            })
          })
          pipe.on('abort', function () {
            fs.unlink('./tmp/' + title, (err) => {
              if (err) {
                reject({
                  error: 'removingfile',
                  url: workerData.url
                })
                return
              }
              resolve({
                error: false,
                url: workerData.url
              })
            })
            reject({
              error: " aborted  ",
              url: workerData.url
            })
          })
          pipe.on('timeout', function () {
            fs.unlink('./tmp/' + title, (err) => {
              if (err) {
                reject({
                  error: 'removingfile',
                  url: workerData.url
                })
                return
              }
              resolve({
                error: false,
                url: workerData.url
              })
            })
            reject({
              error: " timeout  ",
              url: workerData.url
            })
          })
          pipe.on('finish', async function () {

            await uploadFile('./tmp/' + title)
            fs.unlink('./tmp/' + title, (err) => {
              if (err) {
                reject({
                  error: 'removingfile',
                  url: workerData.url
                })
                return
              }
              resolve({
                error: false,
                url: workerData.url
              })
            })

          })
        }
      })
  })
}

export {
  downloadFile as
  default
}