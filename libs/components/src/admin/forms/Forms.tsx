import {ReactNode} from 'react'

export interface HeaderProps {
  children: ReactNode
}

export const Header = ({children}: HeaderProps) => {
  return (
    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
      {children}
    </h6>
  )
}

export const Separator = () => (
  <hr className="mt-6 border-b-1 border-blueGray-300" />
)

export default {Header, Separator}
