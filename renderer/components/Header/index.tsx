import styles from './header.module.scss'

interface IHeaderProps {
  children?: JSX.Element | JSX.Element[]
  title: string
}

const Header = ({ children, title }: IHeaderProps) => {
  return (
    <header className={styles.header}>
      <p>{title}</p>
      <div className={styles.headerButton}>{children}</div>
    </header>
  )
}

export default Header
