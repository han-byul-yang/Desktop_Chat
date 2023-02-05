/* eslint-disable import/no-extraneous-dependencies */
import { ChangeEvent, Dispatch, FormEvent, FormEventHandler, MouseEventHandler, useEffect, useState } from 'react'
import { DocumentData, DocumentReference, arrayUnion, where } from 'firebase/firestore'
import { Unsubscribe, getAuth } from 'firebase/auth'
import { useSetRecoilState, useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil'

import {
  createDocsWithAutoId,
  createDocsWithSpecificId,
  getAllCollectionDocs,
  getSpecificDocs,
  onSnapShotSpecificDocs,
  updateDocs,
} from 'services/firebaseService/firebaseDBService'
import {
  isOpenChatRoomAtom,
  isOpenChooseChattersAtom,
  myInfoDocAtom,
  selectedChatRoomAtom,
  selectedChatterAtom,
} from 'Store/docInfoAtom'
import Header from 'components/Header'

import styles from './chatRoom.module.scss'

interface IChatRoomProps {
  selectedChatRooms: DocumentData
}

const ChatRoom = () => {
  const userAuthInfo = getAuth().currentUser
  const [messageInfo, setMessageInfo] = useState<any>()
  const [inputMessage, setInputMessage] = useState('')
  const [selectedChatRoom, setSelectedChatRoom] = useRecoilState(selectedChatRoomAtom)
  const setIsOpenChatRoom = useSetRecoilState(isOpenChatRoomAtom)
  const selectedChatter = useRecoilValue(selectedChatterAtom)
  const [myInfoDoc, setMyInfoDoc] = useRecoilState(myInfoDocAtom)
  const time = new Date().getTime()
  const resetSelectedChatRoom = useResetRecoilState(selectedChatRoomAtom)
  const resetSelectedChatter = useResetRecoilState(selectedChatterAtom)
  const resetIsOpenChatRoom = useResetRecoilState(isOpenChatRoomAtom)
  const resetIsOpenChooseChatters = useResetRecoilState(isOpenChooseChattersAtom)

  useEffect(() => {
    // 프로필과 채팅상대선택에서 채팅방 개설시 기존 채팅방 여부 확인
    if (!selectedChatRoom?.messageId) {
      const selectedChatterIds = selectedChatter.map((chatter) => chatter.uid) // 밑에 중복있음
      const userAddedChatterUid = [...selectedChatterIds, userAuthInfo?.uid].sort()
      // eslint-disable-next-line prettier/prettier
      const condition = where('member', "in", [[...userAddedChatterUid]])
      getAllCollectionDocs('chatRoomInfo', condition).then((docData) => setSelectedChatRoom(docData[0]))
    }
  }, [selectedChatRoom?.messageId, selectedChatter, setSelectedChatRoom, userAuthInfo?.uid])

  useEffect(() => {
    let unSubscribe
    if (selectedChatRoom?.messageId) {
      getSpecificDocs('messageInfo', selectedChatRoom.messageId).then((docData) => setMessageInfo(docData.data()))
      unSubscribe = onSnapShotSpecificDocs('messageInfo', selectedChatRoom.messageId, setMessageInfo)
    } else {
      setMessageInfo({})
    }

    return unSubscribe // onSnapShot 조건 이용하여 if 문 밖으로
  }, [selectedChatRoom?.messageId])

  useEffect(() => {
    return () => {
      resetIsOpenChatRoom()
      resetIsOpenChooseChatters()
      resetSelectedChatter()
      resetSelectedChatRoom()
    }
  }, [resetIsOpenChatRoom, resetIsOpenChooseChatters, resetSelectedChatRoom, resetSelectedChatter])

  const handleInputMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.currentTarget.value)
  }

  const handleMessageSubmit = async () => {
    if (selectedChatRoom?.messageId) {
      await updateDocs('messageInfo', selectedChatRoom.messageId, {
        messages: arrayUnion({
          text: inputMessage,
          sender: { nickName: userAuthInfo?.displayName, uid: userAuthInfo?.uid },
          time,
        }),
      })
      updateDocs('chatRoomInfo', selectedChatRoom.chatRoomId, { lastMessage: inputMessage })
    } else {
      const messageRef = await createDocsWithAutoId('messageInfo', {
        messages: [
          {
            text: inputMessage,
            sender: { nickName: userAuthInfo?.displayName, uid: userAuthInfo?.uid },
            time,
          },
        ],
      })
      const chatRoomRef: void | DocumentReference<any> = await createDocsWithAutoId('chatRoomInfo', {
        title: selectedChatter.map((chatter) => chatter.nickName),
        member: [...selectedChatter.map((chatter) => chatter.uid), userAuthInfo?.uid].sort(),
        time,
        messageId: messageRef?.id,
        lastMessage: '',
      })
      updateDocs('chatRoomInfo', chatRoomRef?.id, { chatRoomId: chatRoomRef?.id, lastMessage: inputMessage })
      const chatRoomMembers = [...selectedChatter.map((chatter) => chatter.uid), userAuthInfo?.uid]
      chatRoomMembers.forEach((uid) => updateDocs('userInfo', uid!, { chatRoom: arrayUnion(chatRoomRef!.id) }))
      getSpecificDocs('chatRoomInfo', chatRoomRef?.id).then((docData) => setSelectedChatRoom(docData.data()))
    }
  }

  return (
    <div className={styles.chatRoom}>
      <Header title='' />
      <div className={styles.chatScreen}>
        <ul>
          {messageInfo?.messages?.map((message: any, index: number) => {
            const {
              sender: { nickName },
              text,
              time: sentTime,
            } = message
            const messageInfoKey = `messageInfo-${index}`
            return (
              <li key={messageInfoKey} className={styles.messageInfoBox}>
                <p>{nickName}</p>
                <p>{text}</p>
                <p>{sentTime}</p>
              </li>
            )
          })}
        </ul>
        <input type='text' value={inputMessage} onChange={handleInputMessageChange} />
        <button type='button' onClick={handleMessageSubmit}>
          전송
        </button>
      </div>
    </div>
  )
}

export default ChatRoom
