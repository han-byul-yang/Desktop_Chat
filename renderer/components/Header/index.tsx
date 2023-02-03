import styles from './header.module.scss'

interface IHeaderProps {
  title: string
}

const Header = ({ title }: IHeaderProps) => {
  return <header className={styles.header}>{title}</header>
}

export default Header
