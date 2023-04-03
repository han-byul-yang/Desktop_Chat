import { useEffect, useState } from 'react'
import { DocumentData, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useRecoilState, useSetRecoilState } from 'recoil'
import cx from 'classnames'

import useResetAtom from 'hooks/useResetAtom'
import { onSnapShotAllCollectionDocs } from 'service/firebaseService/firebaseDBService'
import { sortChatRoomsByTime } from 'utils/sortInfoList'
import { organizedTime } from 'utils/organizedTime'
import makeChatRoomTitle from 'utils/makeChatRoomTitle'
import cutExceedText from 'utils/cutExceedText'
import { isOpenChatRoomAtom, isOpenChooseChattersAtom, existStoredChatRoomAtom } from 'Store/docInfoAtom'
import Header from 'components/Header'
import HeaderButton from 'components/HeaderButton'

import styles from './chatRooms.module.scss'

const ChatRooms = () => {
  const { uid, displayName } = getAuth().currentUser ?? {}
  const [myChatRoomsInfoDocs, setMyChatRoomsInfoDocs] = useState<(DocumentData | undefined)[]>([])
  const [sortedMyChatRooms, setSortedMyChatRooms] = useState<(DocumentData | undefined)[]>()
  const [existStoredChatRoom, setExistStoredChatRoom] = useRecoilState(existStoredChatRoomAtom)
  const [isOpenChatRoom, setIsOpenChatRoom] = useRecoilState(isOpenChatRoomAtom)
  const setIsOpenChooseChatters = useSetRecoilState(isOpenChooseChattersAtom)
  const { resetSelectedChatter } = useResetAtom()

  useEffect(() => {
    let unsubscribe

    if (uid && displayName) {
      const condition = where('member', 'array-contains', { uid, nickName: displayName })
      unsubscribe = onSnapShotAllCollectionDocs('chatRoomInfo', condition, setMyChatRoomsInfoDocs)
    }

    return unsubscribe
  }, [displayName, uid])

  useEffect(() => {
    const mySortedChatRooms = sortChatRoomsByTime(myChatRoomsInfoDocs)
    setSortedMyChatRooms(mySortedChatRooms)
  }, [myChatRoomsInfoDocs])

  const handleChatRoomClick = (index: number) => {
    setExistStoredChatRoom(myChatRoomsInfoDocs[index])
    setIsOpenChatRoom(true)
    resetSelectedChatter()
  }

  const handleOpenChooseChatterClick = () => {
    setIsOpenChooseChatters(true)
  }

  return (
    <div
      className={cx(styles.chatRooms, {
        [styles.openChatRoom]: isOpenChatRoom,
      })}
    >
      <Header title='채팅방'>
        <HeaderButton title='채팅 상대 선택' handleButtonClick={handleOpenChooseChatterClick} />
      </Header>
      <ul className={styles.chatRoomList}>
        {sortedMyChatRooms?.map((room, index) => {
          const roomKey = `room-${index}`
          const {
            chatRoomId,
            lastMessage: { text, time: textTime },
            member,
          } = room ?? {}
          const chatRoomTitle = makeChatRoomTitle(member, uid) || '내 채팅방'

          return (
            <li
              className={styles.chatRoomItem}
              key={roomKey}
              style={{
                background: chatRoomId === existStoredChatRoom?.chatRoomId ? '#f4f3f3' : 'white',
              }}
            >
              <button type='button' onClick={() => handleChatRoomClick(index)}>
                <p className={styles.title}>{cutExceedText(chatRoomTitle, 40)}</p>
                <p className={styles.time}>{organizedTime(textTime)}</p>
                <p className={styles.lastMessage}>{cutExceedText(text)}</p>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ChatRooms
