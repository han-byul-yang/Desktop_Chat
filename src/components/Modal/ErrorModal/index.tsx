import { useRecoilState } from 'recoil'

import { errorMessageAtom } from 'Store/docInfoAtom'

import { XIcon } from 'assets/svgs'
import styles from './errorModal.module.scss'

const ErrorModal = () => {
  const [errorMessage, setErrorMessage] = useRecoilState(errorMessageAtom)

  const handleCloseModalClick = () => {
    setErrorMessage('')
  }

  return (
    <>
      <div className={styles.background} />
      <div className={styles.modalBox}>
        <p>에러</p>
        <p>{errorMessage}</p>
        <XIcon className={styles.xIcon} onClick={handleCloseModalClick} />
      </div>
    </>
  )
}

export default ErrorModal
