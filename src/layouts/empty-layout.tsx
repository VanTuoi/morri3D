import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const EmptyLayout = ({ children }: Props) => {
  return <div className='min-h-screen flex flex-col items-center justify-center'>{children}</div>
}
