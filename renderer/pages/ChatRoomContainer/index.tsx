/* eslint-disable import/no-extraneous-dependencies */
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'

import useResize from 'hooks/useResize'
import { isOpenChatRoomAtom, isOpenChooseChattersAtom } from 'Store/docInfoAtom'
import ChatRooms from './ChatRooms'
import ChatRoom from './ChatRoom'
import ChooseChatters from 'pages/ChooseChatters'

import styles from './chatRoomContainer.module.scss'

const ChatRoomContainer = () => {
  const isOpenChatRoom = useRecoilValue(isOpenChatRoomAtom)
  const isOpenChooseChatters = useRecoilValue(isOpenChooseChattersAtom)
  const { size, isSize: isDesktop } = useResize()
  const navigate = useRouter()

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
