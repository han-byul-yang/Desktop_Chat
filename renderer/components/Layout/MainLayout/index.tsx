// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactElement } from 'react'

import GNB from 'components/GNB'

import styles from './mainLayout.module.scss'

interface IMainLayoutProps {
  children: ReactElement
}

const MainLayout = ({ children }: IMainLayoutProps) => {
  return (
    <div className={styles.mainLayout}>
      <GNB />
      <main>{children}</main>
    </div>
  )
}

export default MainLayout
