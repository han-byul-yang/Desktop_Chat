import GNB from 'components/GNB'

import styles from './layout.module.scss'

interface ILayoutProps {
  children: JSX.Element
  isLogin: boolean
}

const Layout = ({ children, isLogin }: ILayoutProps) => {
  return isLogin ? (
    <main className={styles.chatMain}>
      <GNB />
      {children}
    </main>
  ) : (
    <main className={styles.authMain}>{children}</main>
  )
}

export default Layout
