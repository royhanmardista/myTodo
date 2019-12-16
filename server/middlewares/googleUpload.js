`use strict`
const gcsUpload = require('gcs-upload')

const upload = gcsUpload({    
    limits: {
      fileSize: 1e6 // in bytes
    },
    gcsConfig: {
      keyFilename: './google-credential.json',
      bucketName: 'royhan-mardista-image'
    }
})

module.exports = upload