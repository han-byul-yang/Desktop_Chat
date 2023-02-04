/* eslint-disable import/no-extraneous-dependencies */
import { ChangeEvent, FormEvent, FormEventHandler, MouseEventHandler, useEffect, useState } from 'react'
import { DocumentData, DocumentReference, arrayUnion } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useSetRecoilState, useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil'

import {
  createDocsWithAutoId,
  createDocsWithSpecificId,
  getSpecificDocs,
  onSnapShotDocs,
  updateDocs,
} from 'services/firebaseService/firebaseDBService'
import { isOpenChatRoomAtom, selectedChatRoomAtom, selectedChatterAtom } from 'Store/docInfoAtom'
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
  const time = new Date().getTime()
  const resetSelectedChatRoom = useResetRecoilState(selectedChatRoomAtom)
  const resetSelectedChatter = useResetRecoilState(selectedChatterAtom)
  const resetIsOpenChatRoom = useResetRecoilState(isOpenChatRoomAtom)

  useEffect(() => {
    if (selectedChatRoom?.messageId) {
      getSpecificDocs('messageInfo', selectedChatRoom.messageId).then((docData) => setMessageInfo(docData.data()))
      onSnapShotDocs('messageInfo', selectedChatRoom.messageId, setMessageInfo)
    }
  }, [selectedChatRoom?.messageId])

  useEffect(() => {
    return () => {
      resetIsOpenChatRoom()
      resetSelectedChatter()
      resetSelectedChatRoom()
    }
  }, [resetIsOpenChatRoom, resetSelectedChatRoom, resetSelectedChatter])

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
        member: [...selectedChatter.map((chatter) => chatter.uid), userAuthInfo?.uid],
        time,
        messageId: messageRef?.id,
        lastMessage: '',
      })
      updateDocs('chatRoomInfo', chatRoomRef?.id, { chatRoomId: chatRoomRef?.id })
      const chatRoomMembers = [...selectedChatter.map((chatter) => chatter.uid), userAuthInfo?.uid]
      chatRoomMembers.forEach((uid) => updateDocs('userInfo', uid!, { chatRoom: arrayUnion(chatRoomRef!.id) }))
      getSpecificDocs('chatRoomInfo', chatRoomRef?.id).then((docData) => setSelectedChatRoom(docData.data()))
    }
  }

  return (
    <div className={styles.chatRoom}>
      <Header title={selectedChatter.map((chatter) => chatter.nickName)[0]} />
      <div className={styles.chatScreen}>
        <ul>
          {messageInfo?.messages?.map((message: any, index: number) => {
            const messageInfoKey = `messageInfo-${index}`
            return (
              <li key={messageInfoKey} className={styles.messageInfoBox}>
                <p>{message.sender.nickName}</p>
                <p>{message.text}</p>
                <p>{message.time}</p>
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
