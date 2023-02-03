import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'
import { DocumentData } from 'firebase/firestore'

import { IUserInfo } from 'types/dbDocType'

import styles from './profileBox.module.scss'

interface IProfileBoxProps {
  selectedUserInfo: DocumentData
  setIsOpenProfile: Dispatch<SetStateAction<boolean>>
}

const ProfileBox = ({ selectedUserInfo, setIsOpenProfile }: IProfileBoxProps) => {
  const handleCloseButtonClick = () => {
    setIsOpenProfile(false)
  }

  return (
    <div className={styles.profileBackground}>
      <div className={styles.profileBox}>
        <p className={styles.nickName}>{selectedUserInfo.nickName}</p>
        <p className={styles.email}>{selectedUserInfo.email}</p>
        <button className={styles.chatButton} type='button'>
          1:1 채팅
        </button>
        <span className={styles.xIcon}>
          <Image src='/svgs/x.svg' width={20} height={20} alt='xIcon' onClick={handleCloseButtonClick} />
        </span>
      </div>
    </div>
  )
}

export default ProfileBox
