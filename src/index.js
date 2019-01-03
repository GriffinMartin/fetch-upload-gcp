import 'dotenv/config'
const async = require('async')
const eachLimit = require('async/eachLimit')
const fs = require('fs')

import downloadFile from './downloader.js'

const parsedData = JSON.parse(fs.readFileSync('./parsed-data.txt'))

// Iterate over parsed data and limit to 2 concurrent processes
async.eachLimit(parsedData, 2, async (recording, callback) => {
  console.log("Initializing: ", recording.title)
  let success = {
    error: true
  }
  try {
    success = await downloadFile(recording, () => {})
  } catch (e) {
    console.log("Error downloading recording: ", e)
    callback()
  }

  if (!success.error) {
    console.log("Uploaded: ", recording.title)
    callback()
  }
})