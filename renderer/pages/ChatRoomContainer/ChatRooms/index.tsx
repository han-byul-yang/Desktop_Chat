/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useEffect, useState } from 'react'
import { DocumentData } from 'firebase/firestore'
import { useSetRecoilState } from 'recoil'

import { MyUidContext } from 'pages/_app'
import { onSnapShotAllCollectionDocs } from 'services/firebaseService/firebaseDBService'
import organizedTime from 'utils/organizedTime'
import { isOpenChatRoomAtom, isOpenChooseChattersAtom, selectedChatRoomAtom } from 'Store/docInfoAtom'
import Header from 'components/Header'

import styles from './chatRooms.module.scss'

interface IChatRoomsProps {
  myChatRoomsInfo: DocumentData[]
}

const ChatRooms = () => {
  const myUid = useContext(MyUidContext)
  const [userInfoDoc, setUserInfoDoc] = useState<DocumentData | undefined>({})
  const [myChatRoomsInfo, setMyChatRoomsInfo] = useState<(DocumentData | undefined)[]>([])
  const setSelectedChatRoom = useSetRecoilState(selectedChatRoomAtom)
  const setIsOpenChatRoom = useSetRecoilState(isOpenChatRoomAtom)
  const setIsOpenChooseChatters = useSetRecoilState(isOpenChooseChattersAtom)

  useEffect(() => {
    const unsubscribe = onSnapShotAllCollectionDocs('chatRoomInfo', myUid, setMyChatRoomsInfo)

    return unsubscribe
  }, [myUid])

  const handleChatRoomClick = (createId: number) => {
    setSelectedChatRoom(myChatRoomsInfo[createId])
    setIsOpenChatRoom(true)
  }

  const handleChooseChatterClick = () => {
    setIsOpenChooseChatters(true)
  }

  return (
    <div className={styles.chatRooms}>
      <div className={styles.chatRoomsHeader}>
        <Header title='채팅방' />
        <button type='button' onClick={handleChooseChatterClick}>
          채팅 상대 선택
        </button>
      </div>
      <ul>
        {myChatRoomsInfo?.map((room, index) => {
          // const { createId, title, lastMessage } = room.data()
          const roomKey = `room-${index}`

          return (
            <li className={styles.chatRoomItem} key={roomKey}>
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
