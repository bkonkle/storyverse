import {useMemo} from 'react'
import clsx from 'clsx'
import {ulid} from 'ulid'
import ReactS3Uploader, {ReactS3UploaderProps} from 'react-s3-uploader'

import {Input} from './Forms'

export interface ImageInputProps extends ReactS3UploaderProps {
  label: string
  error?: string
  hint?: string
}

export const ImageInput = ({
  label,
  className,
  error,
  hint,
  ...rest
}: ImageInputProps) => {
  const id = useMemo(() => ulid(), [])

  return (
    <Input id={id} label={label} error={error} hint={hint}>
      <ReactS3Uploader
        id={id}
        className={clsx('mt-1', 'block', 'w-full', className)}
        signingUrl="/api/s3/sign"
        signingUrlMethod="GET"
        accept="image/*"
        autoUpload={true}
        {...rest}
      />
    </Input>
  )
}

export default ImageInput
