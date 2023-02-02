/* eslint-disable import/no-extraneous-dependencies */
import { useRouter } from 'next/router'
import Link from 'next/link'
import cx from 'classnames'

import styles from './gnb.module.scss'

const navigationInfo = [
  { title: '유저 목록', path: '/UserList' },
  { title: '채팅방', path: '/ChattingRoom' },
]

const GNB = () => {
  const navigation = useRouter()

  return (
    <nav className={styles.gnb}>
      <h1 className={styles.mainName}>MAUM CHAT</h1>
      <ul>
        {navigationInfo.map((info, index) => {
          const nameKey = `name-${index}`

          return (
            <li key={nameKey}>
              <Link href={info.path}>
                <a
                  className={cx(styles.link, {
                    [styles.activeLink]: navigation.pathname === info.path,
                  })}
                >
                  {info.title}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default GNB
