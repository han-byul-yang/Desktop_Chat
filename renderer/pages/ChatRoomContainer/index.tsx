/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { DocumentData } from 'firebase/firestore'

import { AuthStateContext, MyUidContext } from 'pages/_app'
import { getSpecificDocs } from 'services/firebaseService/firebaseDBService'
import { isOpenChatRoomAtom, selectedChatterAtom } from 'Store/docInfoAtom'
import ChatRooms from './ChatRooms'
import ChatRoom from './ChatRoom'

import styles from './chatRoomContainer.module.scss'

const ChatRoomContainer = () => {
  const userAuthState = useContext(AuthStateContext)
  const myUid = useContext(MyUidContext)
  const [profileOpenChatRoom, setProfileOpenChatRoom] = useState<DocumentData>({})
  const isOpenChatRoom = useRecoilValue(isOpenChatRoomAtom)
  const selectedChatter = useRecoilValue(selectedChatterAtom)
  const navigate = useRouter()
  const [myChatRoom, setMyChatRoom] = useState<string[]>([])
  const [myChatRoomsInfo, setMyChatRoomsInfo] = useState<(DocumentData | undefined)[]>([])

  useEffect(() => {
    if (!userAuthState) navigate.push('/SignIn')
  }, [navigate, userAuthState])

  useEffect(() => {
    getSpecificDocs('userInfo', myUid).then((docData) => setMyChatRoom(docData.data()?.chatRoom))
  }, [myUid])

  useEffect(() => {
    const myChatRoomDocs = myChatRoom?.map((room: string) => getSpecificDocs('chatRoomInfo', room))
    Promise.all(myChatRoomDocs).then((docData) => setMyChatRoomsInfo(docData))
  }, [myChatRoom])

  useEffect(() => {
    if (isOpenChatRoom && selectedChatter) {
      const filteredChatRoom = myChatRoomsInfo.filter((docData) => {
        return docData?.data()?.member.includes(selectedChatter || myUid)
      })
      setProfileOpenChatRoom(filteredChatRoom)
    }
  }, [isOpenChatRoom, myChatRoomsInfo, myUid, selectedChatter])

  return (
    <div className={styles.chatRoomContainer}>
      <ChatRooms />
      {isOpenChatRoom && <ChatRoom />}
    </div>
  )
}

export default ChatRoomContainer
