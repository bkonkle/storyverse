import {NextApiRequest, NextApiResponse} from 'next'
import {ulid} from 'ulid'

import {getAws} from '@storyverse/graphql/Aws'

const S3_BUCKET = 'storyverse-dev-storage'

export default function sign(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    const filename =
      (req.query.path || '') + (ulid() + '_') + req.query.objectName
    const mimeType = req.query.contentType

    res.setHeader('Access-Control-Allow-Origin', '*')

    const AWS = getAws()

    const s3 = new AWS.S3()
    const params = {
      Bucket: S3_BUCKET,
      Key: filename,
      Expires: 60,
      ContentType: mimeType,
      ACL: 'private',
    }
    s3.getSignedUrl('putObject', params, function (err, data) {
      if (err) {
        res.status(500).send('Cannot create S3 signed URL')

        reject(err)
      } else {
        res.json({
          signedUrl: data,
          publicUrl: '/api/s3/uploads/' + filename,
          filename: filename,
          fileKey: filename,
        })

        resolve()
      }
    })
  })
}
