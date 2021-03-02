import {NextApiRequest, NextApiResponse} from 'next'

import {getAws} from '../../../../data/Aws'

const S3_BUCKET = 'storyverse-dev-storage'

export default async function sign(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: {all},
  } = req

  const AWS = getAws()

  const s3 = new AWS.S3()
  const params = {
    Bucket: S3_BUCKET,
    Key: all[0],
  }

  s3.getSignedUrl('getObject', params, function (_err, url) {
    res.redirect(url)
  })
}
