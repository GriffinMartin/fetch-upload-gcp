import { Storage } from '@google-cloud/storage'

// Creates a client
const storage = new Storage()
const bucketName = process.env.GCP_BUCKET

const uploadFile = async (filename) => {
  console.log("Uploading: ", filename)
  // Uploads a local file to the bucket
  try {
    await storage.bucket(bucketName).upload(filename, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
    })
  } catch (e) {
    console.log('error uploading', e)
  }

  console.log(`${filename} uploaded to ${bucketName}.`)
}

export {
  uploadFile as
  default
}