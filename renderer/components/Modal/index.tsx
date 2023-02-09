/* eslint-disable import/no-extraneous-dependencies */
import { ReactNode } from 'react'
import ReactDom from 'react-dom'

interface IModalPortalProps {
  children: ReactNode
}

const ModalPortal = ({ children }: IModalPortalProps) => {
  const el = document.getElementById('modal') as HTMLElement
  return ReactDom.createPortal(children, el)
}

export default ModalPortal
