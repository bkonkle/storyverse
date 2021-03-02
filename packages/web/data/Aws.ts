import AWS from 'aws-sdk'

export const getAws = () => {
  const config = {
    region: process.env.AWS_REGION || 'us-west-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
  AWS.config.update(config)

  return AWS
}
