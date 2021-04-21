import {NextApiRequest, NextApiResponse} from 'next'

import {getAws} from '@storyverse/shared/data/Aws'

const S3_BUCKET = 'storyverse-dev-storage'

export default async function sign(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    const {
      query: {all},
    } = req

    const AWS = getAws()

    const s3 = new AWS.S3()
    const params = {
      Bucket: S3_BUCKET,
      Key: Array.isArray(all) ? all.join('/') : all,
    }

    s3.getSignedUrl('getObject', params, function (err, url) {
      if (err) {
        reject(err)
      }

      res.redirect(url)

      resolve()
    })
  })
}
