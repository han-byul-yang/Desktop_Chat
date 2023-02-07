// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactElement } from 'react'

import styles from './authLayout.module.scss'

interface IAuthLayoutProps {
  children: ReactElement
}

const AuthLayout = ({ children }: IAuthLayoutProps) => {
  return <main className={styles.authLayout}>{children}</main>
}

export default AuthLayout
