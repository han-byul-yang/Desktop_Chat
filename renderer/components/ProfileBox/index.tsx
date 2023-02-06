/* eslint-disable import/no-extraneous-dependencies */
import { Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSetRecoilState } from 'recoil'
import { DocumentData } from 'firebase/firestore'

import { isOpenChatRoomAtom, selectedChattersAtom } from 'Store/docInfoAtom'

import styles from './profileBox.module.scss'

interface IProfileBoxProps {
  selectedUserInfoDoc: DocumentData
  setIsOpenProfile: Dispatch<SetStateAction<boolean>>
}

const ProfileBox = ({ selectedUserInfoDoc, setIsOpenProfile }: IProfileBoxProps) => {
  const { uid, nickName, email } = selectedUserInfoDoc
  const setIsOpenChatRoom = useSetRecoilState(isOpenChatRoomAtom)
  const setSelectedChatters = useSetRecoilState(selectedChattersAtom)
  const navigate = useRouter()

  const handleCloseButtonClick = () => {
    setIsOpenProfile(false)
  }

  const handleStartChatButtonClick = async () => {
    setIsOpenChatRoom(true)
    setSelectedChatters([{ uid, nickName }])
    navigate.push('/ChatRoomContainer')
    setIsOpenProfile(false)
  }

  return (
    <div className={styles.profileBackground}>
      <div className={styles.profileBox}>
        <p className={styles.nickName}>{nickName}</p>
        <p className={styles.email}>{email}</p>
        <button className={styles.chatButton} type='button' onClick={handleStartChatButtonClick}>
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
