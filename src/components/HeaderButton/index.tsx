import styles from './headerButton.module.scss'

interface IHeaderButtonProps {
  title: string
  handleButtonClick: () => void
}

const HeaderButton = ({ title, handleButtonClick }: IHeaderButtonProps) => {
  return (
    <button className={styles.headerButton} type='button' onClick={handleButtonClick}>
      {title}
    </button>
  )
}

export default HeaderButton
