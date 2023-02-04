/* eslint-disable import/no-extraneous-dependencies */
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Dispatch, SetStateAction, useContext } from 'react'
import { useSetRecoilState } from 'recoil'
import { DocumentData } from 'firebase/firestore'

import { MyUidContext } from 'pages/_app'
import { createDocsWithAutoId, updateDocs } from 'services/firebaseService/firebaseDBService'
import { isOpenChatRoomAtom, myInfoDocAtom, selectedChatterAtom } from 'Store/docInfoAtom'
import { IUserInfo } from 'types/dbDocType'

import styles from './profileBox.module.scss'

interface IProfileBoxProps {
  myInfoDoc: DocumentData
  selectedUserInfoDoc: DocumentData
  setIsOpenProfile: Dispatch<SetStateAction<boolean>>
}

const ProfileBox = ({ myInfoDoc, selectedUserInfoDoc, setIsOpenProfile }: IProfileBoxProps) => {
  // const myUid = useContext(MyUidContext)
  const setIsOpenChatRoom = useSetRecoilState(isOpenChatRoomAtom)
  const setSelectedChatter = useSetRecoilState(selectedChatterAtom)
  const navigate = useRouter()
  // const time = new Date().getTime()

  const handleCloseButtonClick = () => {
    setIsOpenProfile(false)
  }

  const handleStartChatButtonClick = async () => {
    /*    const docRef = await createDocsWithAutoId('chatRoomInfo', {
      time,
      group: false,
      member: [selectedUserInfoDoc.uid, myUid],
    })
    updateDocs('userInfo', myUid, { chatRoom: [...myInfoDoc.chatRoom, docRef?.id] })
*/
    setIsOpenChatRoom(true)
    setSelectedChatter([{ uid: selectedUserInfoDoc.uid, nickName: selectedUserInfoDoc.nickName }])
    navigate.push('/ChatRoomContainer')
    setIsOpenProfile(false)
  }

  return (
    <div className={styles.profileBackground}>
      <div className={styles.profileBox}>
        <p className={styles.nickName}>{selectedUserInfoDoc.nickName}</p>
        <p className={styles.email}>{selectedUserInfoDoc.email}</p>
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
