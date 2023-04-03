import { NavLink, useNavigate } from 'react-router-dom'
import cx from 'classnames'

import styles from './gnb.module.scss'

const navigationInfo = [
  { title: '유저 목록', path: '/' },
  { title: '채팅방', path: '/chatRoom' },
]

const GNB = () => {
  const navigation = useNavigate()

  return (
    <nav className={styles.gnb}>
      <h1 className={styles.mainName}>MAUM CHAT</h1>
      <ul>
        {navigationInfo.map((info, index) => {
          const nameKey = `name-${index}`

          return (
            <li key={nameKey}>
              <NavLink
                to={info.path}
                className={cx(styles.link, {
                  [styles.activeLink]: navigation.name === info.path,
                })}
              >
                {info.title}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default GNB
