import { Outlet } from 'react-router-dom'

import GNB from 'components/GNB'

import styles from './mainLayout.module.scss'

const MainLayout = () => {
  return (
    <div className={styles.mainLayout}>
      <GNB />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
