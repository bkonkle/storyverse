import {NextApiRequest, NextApiResponse} from 'next'
import {v4 as uuidv4} from 'uuid'
import AWS from 'aws-sdk'

const S3_BUCKET = 'storyverse-dev-storage'

export default function sign(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    const filename =
      (req.query.path || '') + (uuidv4() + '_') + req.query.objectName
    const mimeType = req.query.contentType

    res.setHeader('Access-Control-Allow-Origin', '*')

    const {AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env

    const config = {
      region: AWS_REGION || 'us-west-2',
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
    AWS.config.update(config)

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
          publicUrl: '/s3/uploads/' + filename,
          filename: filename,
          fileKey: filename,
        })

        resolve()
      }
    })
  })
}
