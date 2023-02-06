/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { DocumentData, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { AuthStateContext } from 'pages/_app'
import useResetAtom from 'hooks/useResetAtom'
import { getSpecificDocs, onSnapShotAllCollectionDocs } from 'services/firebaseService/firebaseDBService'
import { organizedTime } from 'utils/organizedTime'
import { isOpenChatRoomAtom, isOpenChooseChattersAtom, existStoredChatRoomAtom } from 'Store/docInfoAtom'
import Header from 'components/Header'
import HeaderButton from 'components/HeaderButton'

import styles from './chatRooms.module.scss'

const ChatRooms = () => {
  const { uid } = getAuth().currentUser ?? {}
  const [myChatRoomsInfoDocs, setMyChatRoomsInfoDocs] = useState<(DocumentData | undefined)[]>([])
  const [sortedChatRooms, setSortedChatRooms] = useState<(DocumentData | undefined)[]>()
  const [existStoredChatRoom, setExistStoredChatRoom] = useRecoilState(existStoredChatRoomAtom)
  const setIsOpenChatRoom = useSetRecoilState(isOpenChatRoomAtom)
  const setIsOpenChooseChatters = useSetRecoilState(isOpenChooseChattersAtom)
  const { resetSelectedChatter } = useResetAtom()
  const userAuthState = useContext(AuthStateContext)
  const navigate = useRouter()
  const nickNameRef = useRef('')

  useEffect(() => {
    if (!userAuthState) navigate.push('/SignIn')
  }, [navigate, userAuthState])

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    const condition = where("member", "array-contains", uid)
    const unsubscribe = onSnapShotAllCollectionDocs('chatRoomInfo', condition, setMyChatRoomsInfoDocs)

    return unsubscribe
  }, [uid])

  useEffect(() => {
    const sortChatRoomByTime = () => {
      const mySortedChatRooms = myChatRoomsInfoDocs.sort(
        (a, b) => Number(b!.lastMessage.time) - Number(a!.lastMessage.time)
      )
      setSortedChatRooms(mySortedChatRooms)
    }
    sortChatRoomByTime()
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
    <div className={styles.chatRooms}>
      <Header title='채팅방'>
        <HeaderButton title='채팅 상대 선택' handleButtonClick={handleOpenChooseChatterClick} />
      </Header>
      <ul className={styles.chatRoomList}>
        {sortedChatRooms?.map((room, index) => {
          const {
            title,
            time,
            lastMessage: { text, time: textTime },
            member,
          } = room ?? {}

          return (
            <li className={styles.chatRoomItem} key={index} style={{ background: member === '' ? '#f4f3f3' : 'white' }}>
              <button type='button' onClick={() => handleChatRoomClick(index)}>
                <p className={styles.title}>멤버</p>
                <p className={styles.time}>{organizedTime(textTime)}</p>
                <p className={styles.lastMessage}>{text}</p>
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
