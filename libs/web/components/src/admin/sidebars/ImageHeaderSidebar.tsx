import clsx from 'clsx'
import {ReactNode} from 'react'

export interface ImageHeaderSidebarProps {
  children?: ReactNode
  alt: string
  src: string
  stats?: {name: string; value: string}[]
  circle?: boolean
}

export default function ImageHeaderSidebar({
  children,
  alt,
  src,
  stats,
  circle,
}: ImageHeaderSidebarProps) {
  return (
    <div
      className={clsx(
        'relative',
        'flex',
        'flex-col',
        'min-w-0',
        'break-words',
        'bg-white',
        'w-full',
        'mb-6',
        'shadow-xl',
        'rounded-lg',
        'mt-16'
      )}
    >
      <div className="px-6">
        <div className="flex flex-wrap justify-center">
          <div className="w-full px-4 flex justify-center">
            <div className="relative">
              <img
                alt={alt}
                src={src}
                className={clsx(
                  'shadow-xl',
                  circle ? 'rounded-full' : 'rounded-xl',
                  'h-auto',
                  'align-middle',
                  'border-none',
                  '-m-16',
                  '-ml-20',
                  'lg:-ml-16',
                  'max-w-150-px'
                )}
              />
            </div>
          </div>
          <div className="w-full px-4 text-center mt-20">
            <div className="flex justify-center py-4 lg:pt-4 pt-8">
              {stats?.length &&
                stats.map((stat) => (
                  <div key={stat.name} className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      {stat.value}
                    </span>
                    <span className="text-sm text-blueGray-400">
                      {stat.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12 pb-10">{children}</div>
      </div>
    </div>
  )
}
