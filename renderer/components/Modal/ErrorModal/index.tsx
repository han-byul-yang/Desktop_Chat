/* eslint-disable import/no-extraneous-dependencies */
import { useRecoilState } from 'recoil'
import Image from 'next/image'

import { errorMessageAtom } from 'Store/docInfoAtom'

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
        <div className={styles.xIcon}>
          <Image src='/svgs/x.svg' width={20} height={20} alt='xIcon' onClick={handleCloseModalClick} />
        </div>
      </div>
    </>
  )
}

export default ErrorModal
