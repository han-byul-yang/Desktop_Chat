/* eslint-disable import/no-extraneous-dependencies */
import { ChangeEvent, useEffect, useState } from 'react'
import { DocumentData, DocumentReference, arrayUnion, where } from 'firebase/firestore'
import { Unsubscribe, getAuth } from 'firebase/auth'
import { useSetRecoilState, useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil'
import cx from 'classnames'

import {
  createDocsWithAutoId,
  getAllCollectionDocs,
  getSpecificDocs,
  onSnapShotSpecificDocs,
  updateDocs,
} from 'services/firebaseService/firebaseDBService'
import { checkNewDayStart, firstDay, nightDayTime } from 'utils/organizedTime'
import manageLineChange from 'utils/manageLineChange'
import {
  isOpenChatRoomAtom,
  isOpenChooseChattersAtom,
  myInfoDocAtom,
  selectedChatRoomAtom,
  selectedChatterAtom,
} from 'Store/docInfoAtom'
import Header from 'components/Header'
import HeaderButton from 'components/HeaderButton'

import styles from './chatRoom.module.scss'

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

  const selectedChatterNickName = selectedChatter.map((chatter) => chatter.nickName)
  const selectedChatterUid = selectedChatter.map((chatter) => chatter.uid)

  useEffect(() => {
    // 프로필과 채팅상대선택에서 채팅방 개설시 기존 채팅방 여부 확인
    if (!selectedChatRoom?.messageId) {
      const userAddedChatterUid = [...selectedChatterUid, userAuthInfo?.uid].sort()
      // eslint-disable-next-line prettier/prettier
      const condition = where('member', "in", [[...userAddedChatterUid]])
      getAllCollectionDocs('chatRoomInfo', condition).then((docData) => setSelectedChatRoom(docData[0]))
    }
  }, [selectedChatRoom?.messageId, selectedChatterUid, setSelectedChatRoom, userAuthInfo?.uid])

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

  const handleInputMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.currentTarget.value)
  }

  const handleCloseButtonClick = () => {
    setIsOpenChatRoom(false)
  }

  const handleMessageSubmit = async (e: any) => {
    e.preventDefault()
    setInputMessage('')
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
        title: selectedChatterNickName.join(','),
        member: [...selectedChatterUid, userAuthInfo?.uid].sort(),
        time,
        messageId: messageRef?.id,
        lastMessage: '',
      })
      updateDocs('chatRoomInfo', chatRoomRef?.id, {
        chatRoomId: chatRoomRef?.id,
        lastMessage: inputMessage,
      })
      const chatRoomMembers = [...selectedChatterUid, userAuthInfo?.uid]
      chatRoomMembers.forEach((uid) => updateDocs('userInfo', uid!, { chatRoom: arrayUnion(chatRoomRef!.id) }))
      getSpecificDocs('chatRoomInfo', chatRoomRef?.id).then((docData) => setSelectedChatRoom(docData.data()))
    }
  }

  return (
    <div className={styles.chatRoom}>
      <Header title={selectedChatterNickName.join(',') || selectedChatRoom?.title}>
        <HeaderButton title='채팅방 닫기' handleButtonClick={handleCloseButtonClick} />
      </Header>
      <div className={styles.chatBox}>
        <ul className={styles.chatScreen}>
          {messageInfo?.messages?.map((message: DocumentData, index: number) => {
            const {
              sender: { nickName, uid },
              text,
              time: sentTime,
            } = message
            const messageInfoKey = `messageInfo-${index}`
            const myMessage = userAuthInfo?.uid === uid
            const prevMessagInfo = messageInfo?.messages[index - 1]
            const newDayStart = !index ? firstDay(sentTime) : checkNewDayStart(prevMessagInfo?.time, sentTime)

            return (
              <li key={messageInfoKey} className={styles.messageInfoBox}>
                {newDayStart && <p className={styles.newDate}>{newDayStart}</p>}
                <div
                  className={cx(styles.messageBox, {
                    [styles.myMessageBox]: myMessage,
                  })}
                >
                  {uid !== prevMessagInfo?.sender.uid && <p className={styles.nickName}>{nickName}</p>}
                  <div>
                    {myMessage ? (
                      <>
                        <p className={styles.sentTime}>{nightDayTime(sentTime)}</p>
                        <p className={styles.myText}>{manageLineChange(text)}</p>
                      </>
                    ) : (
                      <>
                        <p className={styles.text}>{manageLineChange(text)}</p>
                        <p className={styles.sentTime}>{nightDayTime(sentTime)}</p>
                      </>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        <form onSubmit={handleMessageSubmit}>
          <textarea name='text' value={inputMessage} onChange={handleInputMessageChange} />
          <button type='button' onClick={handleMessageSubmit}>
            전송
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatRoom
