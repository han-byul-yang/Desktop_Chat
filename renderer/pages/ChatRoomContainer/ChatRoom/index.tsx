/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { ChangeEvent, useEffect, useState } from 'react'
import { DocumentData, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil'
import cx from 'classnames'

import {
  createDocsWithAutoId,
  getAllCollectionDocs,
  getSpecificDocs,
  onSnapShotSpecificDocs,
  updateDocs,
} from 'services/firebaseService/firebaseDBService'
import useResetAtom from 'hooks/useResetAtom'
import { newDayStart, firstDay, dayNightTime } from 'utils/organizedTime'
import manageLineChange from 'utils/manageLineChange'
import { createChatRoomInfoData, createMessageInfoData } from 'utils/InfoDataForStore'
import { isOpenChatRoomAtom, existStoredChatRoomAtom, selectedChattersAtom } from 'Store/docInfoAtom'
import Header from 'components/Header'
import HeaderButton from 'components/HeaderButton'

import styles from './chatRoom.module.scss'

const ChatRoom = () => {
  const { uid, displayName } = getAuth().currentUser ?? {}
  const [messageInfoDoc, setMessageInfoDoc] = useState<DocumentData>()
  const [inputMessage, setInputMessage] = useState('')
  const [existStoredChatRoom, setExistStoredChatRoom] = useRecoilState(existStoredChatRoomAtom)
  const selectedChatters = useRecoilValue(selectedChattersAtom)
  const setIsOpenChatRoom = useSetRecoilState(isOpenChatRoomAtom)
  const time = new Date().getTime()
  const [chatRoomId, setChatRoomId] = useState('')
  const { resetExistStoredChatRoom, resetIsOpenChatRoom, resetIsOpenChooseChatters, resetSelectedChatter } =
    useResetAtom()

  const selectedChatterUids = selectedChatters.map((chatter) => chatter.uid)
  const selectedChatterNickNames = selectedChatters.map((chatter) => chatter.nickName)
  const organizedAllChatterUids = [...selectedChatterUids, uid].sort()

  useEffect(() => {
    // 프로필과 채팅상대선택에서 채팅방 개설시 기존 채팅방 여부 확인
    function getIfExistStoredChatRoom() {
      if (!existStoredChatRoom?.messageId) {
        // eslint-disable-next-line prettier/prettier
      const condition = where('member', "in", [[...organizedAllChatterUids]])
        getAllCollectionDocs('chatRoomInfo', condition).then((docData) => setExistStoredChatRoom(docData[0]))
      }
    }
    getIfExistStoredChatRoom()
  }, [existStoredChatRoom?.messageId, organizedAllChatterUids, setExistStoredChatRoom])

  useEffect(() => {
    // 채팅방 목록에서 채팅방 클릭 시
    function getChatMessageInfo() {
      if (existStoredChatRoom?.messageId) {
        getSpecificDocs('messageInfo', existStoredChatRoom.messageId).then((docData) =>
          setMessageInfoDoc(docData.data())
        )
        const unSubscribe = onSnapShotSpecificDocs('messageInfo', existStoredChatRoom.messageId, setMessageInfoDoc)
        return unSubscribe
      }
      setMessageInfoDoc({})
    }

    return getChatMessageInfo()
  }, [existStoredChatRoom?.messageId])

  useEffect(() => {
    return () => {
      resetIsOpenChatRoom()
      resetIsOpenChooseChatters()
      resetSelectedChatter()
      resetExistStoredChatRoom()
    }
  }, [resetIsOpenChatRoom, resetIsOpenChooseChatters, resetExistStoredChatRoom, resetSelectedChatter])

  const handleInputMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.currentTarget.value)
  }

  const handleCloseButtonClick = () => {
    setIsOpenChatRoom(false)
  }

  const handleMessageSubmit = async (e: any) => {
    e.preventDefault()
    setInputMessage('')
    const messageInfoData = createMessageInfoData(inputMessage, displayName, uid, time)

    if (existStoredChatRoom?.messageId) {
      await updateDocs('messageInfo', existStoredChatRoom.messageId, messageInfoData)
      updateDocs('chatRoomInfo', existStoredChatRoom.chatRoomId, { lastMessage: inputMessage })
    } else {
      const messageRef = await createDocsWithAutoId('messageInfo', messageInfoData)
      const chatRoomInfoData = createChatRoomInfoData(organizedAllChatterUids, time, messageRef?.id, '')
      await createDocsWithAutoId('chatRoomInfo', chatRoomInfoData).then((docData) => setChatRoomId(docData?.id!))
      updateDocs('chatRoomInfo', chatRoomId, {
        chatRoomId,
        lastMessage: inputMessage,
      })
      getSpecificDocs('chatRoomInfo', chatRoomId).then((docData) => setExistStoredChatRoom(docData.data()))
    }
  }

  return (
    <div className={styles.chatRoom}>
      <Header title={selectedChatterNickNames.join(',') || '임시제목임'}>
        <HeaderButton title='채팅방 닫기' handleButtonClick={handleCloseButtonClick} />
      </Header>
      <div className={styles.chatBox}>
        <ul className={styles.chatScreen}>
          {messageInfoDoc?.messages?.map((message: DocumentData, index: number) => {
            const {
              sender: { nickName, uid: senderId },
              text,
              time: sentTime,
            } = message
            const messageInfoKey = `messageInfo-${index}`
            const isMyMessage = senderId === uid
            const prevMessagInfo = messageInfoDoc?.messages[index - 1]
            const newDay = !index ? firstDay(sentTime) : newDayStart(prevMessagInfo?.time, sentTime)

            return (
              <li key={messageInfoKey} className={styles.messageInfoBox}>
                {newDay && <p className={styles.newDate}>{newDay}</p>}
                <div
                  className={cx(styles.messageBox, {
                    [styles.myMessageBox]: isMyMessage,
                  })}
                >
                  {uid !== prevMessagInfo?.sender.uid && <p className={styles.nickName}>{nickName}</p>}
                  <div>
                    {isMyMessage ? (
                      <>
                        <p className={styles.sentTime}>{dayNightTime(sentTime)}</p>
                        <p className={styles.myText}>{manageLineChange(text)}</p>
                      </>
                    ) : (
                      <>
                        <p className={styles.text}>{manageLineChange(text)}</p>
                        <p className={styles.sentTime}>{dayNightTime(sentTime)}</p>
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
