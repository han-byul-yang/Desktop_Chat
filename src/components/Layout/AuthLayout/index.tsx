import { Outlet } from 'react-router-dom'

import styles from './authLayout.module.scss'

const AuthLayout = () => {
  return (
    <main className={styles.authLayout}>
      <Outlet />
    </main>
  )
}

export default AuthLayout
