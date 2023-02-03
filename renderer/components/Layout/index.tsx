import GNB from 'components/GNB'

import styles from './layout.module.scss'

interface ILayoutProps {
  children: JSX.Element
  isLogin: boolean
}

const Layout = ({ children, isLogin }: ILayoutProps) => {
  return isLogin ? (
    <div className={styles.chatContainer}>
      <GNB />
      <main className={styles.chatMain}>{children}</main>
    </div>
  ) : (
    <main className={styles.authMain}>{children}</main>
  )
}

export default Layout
