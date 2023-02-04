/* eslint-disable import/no-extraneous-dependencies */
import { ChangeEvent, Dispatch, FormEvent, FormEventHandler, MouseEventHandler, useEffect, useState } from 'react'
import { DocumentData, DocumentReference, arrayUnion } from 'firebase/firestore'
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
import { isOpenChatRoomAtom, myInfoDocAtom, selectedChatRoomAtom, selectedChatterAtom } from 'Store/docInfoAtom'
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

  useEffect(() => {
    getAllCollectionDocs('chatRoomInfo').then((docData) => {
      const filteredChatRoom =
        selectedChatter[0].uid === userAuthInfo?.uid
          ? docData.filter((data) => data.member[0] === data.member[1])
          : docData.filter(
              (data) =>
                data.member.length <= 2 &&
                data.member.includes(selectedChatter[0].uid) &&
                data.member.includes(userAuthInfo?.uid)
            )
      if (filteredChatRoom) {
        setSelectedChatRoom(filteredChatRoom[0])
      }
    })
  }, [selectedChatter, setSelectedChatRoom, userAuthInfo?.uid])

  useEffect(() => {
    let unSubscribe

    if (selectedChatRoom?.messageId) {
      getSpecificDocs('messageInfo', selectedChatRoom.messageId).then((docData) => setMessageInfo(docData.data()))
      unSubscribe = onSnapShotSpecificDocs('messageInfo', selectedChatRoom.messageId, setMessageInfo)
    }

    return unSubscribe // onSnapShot 조건 이용하여 if 문 밖으로
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
      updateDocs('chatRoomInfo', chatRoomRef?.id, { chatRoomId: chatRoomRef?.id, lastMessage: inputMessage })
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
