/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useEffect, useState } from 'react'
import { DocumentData } from 'firebase/firestore'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'

import { MyUidContext } from 'pages/_app'
import { onSnapShotAllCollectionDocs } from 'services/firebaseService/firebaseDBService'
import organizedTime from 'utils/organizedTime'
import {
  isOpenChatRoomAtom,
  isOpenChooseChattersAtom,
  selectedChatRoomAtom,
  selectedChatterAtom,
} from 'Store/docInfoAtom'
import Header from 'components/Header'
import HeaderButton from 'components/HeaderButton'

import styles from './chatRooms.module.scss'

interface IChatRoomsProps {
  myChatRoomsInfo: DocumentData[]
}

const ChatRooms = () => {
  const myUid = useContext(MyUidContext)
  const [userInfoDoc, setUserInfoDoc] = useState<DocumentData | undefined>({})
  const [myChatRoomsInfo, setMyChatRoomsInfo] = useState<(DocumentData | undefined)[]>([])
  const [selectedChatRoom, setSelectedChatRoom] = useRecoilState(selectedChatRoomAtom)
  const setIsOpenChatRoom = useSetRecoilState(isOpenChatRoomAtom)
  const setIsOpenChooseChatters = useSetRecoilState(isOpenChooseChattersAtom)
  const resetSelectedChatter = useResetRecoilState(selectedChatterAtom)

  useEffect(() => {
    const unsubscribe = onSnapShotAllCollectionDocs('chatRoomInfo', myUid, setMyChatRoomsInfo)

    return unsubscribe
  }, [myUid])

  const handleChatRoomClick = (createId: number) => {
    setSelectedChatRoom(myChatRoomsInfo[createId])
    setIsOpenChatRoom(true)
    resetSelectedChatter()
  }

  const handleChooseChatterClick = () => {
    setIsOpenChooseChatters(true)
  }

  return (
    <div className={styles.chatRooms}>
      <Header title='채팅방'>
        <HeaderButton title='채팅 상태 선택' handleButtonClick={handleChooseChatterClick} />
      </Header>
      <ul className={styles.chatRoomList}>
        {myChatRoomsInfo?.map((room, index) => {
          // const { createId, title, lastMessage } = room.data()

          return (
            <li
              className={styles.chatRoomItem}
              key={room?.title}
              style={{ background: selectedChatRoom?.title === room?.title ? '#f4f3f3' : 'white' }}
            >
              <button type='button' onClick={() => handleChatRoomClick(index)}>
                <p className={styles.title}>{room?.title}</p>
                <p className={styles.time}>{organizedTime(room?.time)}</p>
                <p className={styles.lastMessage}>{room?.lastMessage}</p>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ChatRooms

// organizedTime useMemo 사용 여부
