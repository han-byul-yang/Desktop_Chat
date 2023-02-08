/* eslint-disable import/no-extraneous-dependencies */
import { useRecoilValue } from 'recoil'

import { isOpenChatRoomAtom, isOpenChooseChattersAtom } from 'Store/docInfoAtom'
import ChatRooms from './ChatRooms'
import ChatRoom from './ChatRoom'
import ChooseChatters from 'pages/ChooseChatters'

import styles from './chatRoomContainer.module.scss'

const ChatRoomContainer = () => {
  const isOpenChatRoom = useRecoilValue(isOpenChatRoomAtom)
  const isOpenChooseChatters = useRecoilValue(isOpenChooseChattersAtom)

  return (
    <div className={styles.chatRoomContainer}>
      <ChatRooms />
      {isOpenChatRoom && <ChatRoom />}
      {isOpenChooseChatters && <ChooseChatters />}
    </div>
  )
}

export default ChatRoomContainer
