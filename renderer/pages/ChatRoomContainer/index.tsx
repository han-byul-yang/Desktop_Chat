/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { DocumentData } from 'firebase/firestore'

import { AuthStateContext, MyUidContext } from 'pages/_app'
import { getSpecificDocs } from 'services/firebaseService/firebaseDBService'
import useResize from 'hooks/useResize'
import { isOpenChatRoomAtom, isOpenChooseChattersAtom, selectedChatterAtom } from 'Store/docInfoAtom'
import ChatRooms from './ChatRooms'
import ChatRoom from './ChatRoom'
import ChooseChatters from 'pages/ChooseChatters'

import styles from './chatRoomContainer.module.scss'

const ChatRoomContainer = () => {
  const userAuthState = useContext(AuthStateContext)
  const myUid = useContext(MyUidContext)
  const [profileOpenChatRoom, setProfileOpenChatRoom] = useState<DocumentData>({})
  const isOpenChatRoom = useRecoilValue(isOpenChatRoomAtom)
  const selectedChatter = useRecoilValue(selectedChatterAtom)
  const isOpenChooseChatters = useRecoilValue(isOpenChooseChattersAtom)
  const { size, isSize: isDesktop } = useResize()
  const navigate = useRouter()
  const [myChatRoom, setMyChatRoom] = useState<string[]>([])
  const [myChatRoomsInfo, setMyChatRoomsInfo] = useState<(DocumentData | undefined)[]>([])

  useEffect(() => {
    size.DESKTOP.RESIZE()
    size.DESKTOP.SIZEEVENT()
  }, [size.DESKTOP])

  return (
    <div className={styles.chatRoomContainer}>
      <ChatRooms />
      {isOpenChatRoom && <ChatRoom />}
      {isOpenChooseChatters && <ChooseChatters />}
    </div>
  )
}

export default ChatRoomContainer
