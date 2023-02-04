/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useEffect, useState } from 'react'
import { DocumentData } from 'firebase/firestore'
import { useSetRecoilState } from 'recoil'

import { MyUidContext } from 'pages/_app'
import { getSpecificDocs } from 'services/firebaseService/firebaseDBService'
import { isOpenChatRoomAtom, selectedChatRoomAtom } from 'Store/docInfoAtom'
import Header from 'components/Header'

import styles from './chatRooms.module.scss'

interface IChatRoomsProps {
  myChatRoomsInfo: DocumentData[]
}

const ChatRooms = () => {
  const myUid = useContext(MyUidContext)
  const [myChatRoom, setMyChatRoom] = useState<string[]>([])
  const [myChatRoomsInfo, setMyChatRoomsInfo] = useState<(DocumentData | undefined)[]>([])
  const setSelectedChatRoom = useSetRecoilState(selectedChatRoomAtom)
  const setIsOpenChatRoom = useSetRecoilState(isOpenChatRoomAtom)

  useEffect(() => {
    getSpecificDocs('userInfo', myUid).then((docData) => setMyChatRoom(docData.data()?.chatRoom))
  }, [myUid])

  useEffect(() => {
    const myChatRoomDocs = myChatRoom?.map((room: string) => getSpecificDocs('chatRoomInfo', room))

    Promise.all(myChatRoomDocs).then((docData) => {
      const docDataList = docData.map((data) => data.data())
      setMyChatRoomsInfo(docDataList)
    })
  }, [myChatRoom])

  const handleChatRoomClick = (createId: number) => {
    setSelectedChatRoom(myChatRoomsInfo[createId])
    setIsOpenChatRoom(true)
  }

  return (
    <div className={styles.chatRooms}>
      <Header title='채팅방' />
      <ul>
        {myChatRoomsInfo?.map((room, index) => {
          // const { createId, title, lastMessage } = room.data()
          const roomKey = `room-${index}`

          return (
            <li key={roomKey}>
              <button type='button' onClick={() => handleChatRoomClick(index)}>
                <p>{room?.title}</p>
                <p>{room?.lastMessage}</p>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ChatRooms
