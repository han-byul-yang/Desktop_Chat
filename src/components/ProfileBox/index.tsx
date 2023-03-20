import { Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { DocumentData } from 'firebase/firestore'

import { isOpenChatRoomAtom, selectedChattersAtom } from 'Store/docInfoAtom'

import styles from './profileBox.module.scss'
import { XIcon } from 'assets/svgs'

interface IProfileBoxProps {
  selectedUserInfoDoc: DocumentData
  setIsOpenProfile: Dispatch<SetStateAction<boolean>>
}

const ProfileBox = ({ selectedUserInfoDoc, setIsOpenProfile }: IProfileBoxProps) => {
  const { uid, nickName, email } = selectedUserInfoDoc
  const setIsOpenChatRoom = useSetRecoilState(isOpenChatRoomAtom)
  const setSelectedChatters = useSetRecoilState(selectedChattersAtom)
  const navigate = useNavigate()

  const handleCloseButtonClick = () => {
    setIsOpenProfile(false)
  }

  const handleStartChatButtonClick = async () => {
    setIsOpenChatRoom(true)
    setSelectedChatters([{ uid, nickName }])
    navigate('/chatRoom')
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
        <XIcon className={styles.xIcon} onClick={handleCloseButtonClick} />
      </div>
    </div>
  )
}

export default ProfileBox
