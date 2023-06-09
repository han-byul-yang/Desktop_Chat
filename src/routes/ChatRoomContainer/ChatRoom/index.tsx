/* eslint-disable consistent-return */
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { DocumentData, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useRecoilValue, useRecoilState } from 'recoil'
import cx from 'classnames'

import {
  createDocsWithAutoId,
  getAllCollectionDocs,
  getSpecificDocs,
  onSnapShotSpecificDocs,
  updateDocs,
} from 'service/firebaseService/firebaseDBService'
import useResetAtom from 'hooks/useResetAtom'
import { sortChattersByNickName } from 'utils/sortInfoList'
import { newDayStart, firstDay, dayNightTime, sameHourMinute } from 'utils/organizedTime'
import manageLineChange from 'utils/manageLineChange'
import { createChatRoomInfoData, createMessageInfoData } from 'utils/InfoDataForStore'
import makeChatRoomTitle from 'utils/makeChatRoomTitle'
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
  const [isOpenChatRoom, setIsOpenChatRoom] = useRecoilState(isOpenChatRoomAtom)
  const time = new Date().getTime()
  const { resetExistStoredChatRoom, resetIsOpenChatRoom, resetIsOpenChooseChatters, resetSelectedChatter } =
    useResetAtom()

  const selectedChatterNickNames = selectedChatters.map((chatter) => chatter.nickName)
  const allChatters = useMemo(
    () => sortChattersByNickName([...selectedChatters, { uid, nickName: displayName }]),
    [displayName, selectedChatters, uid]
  )

  useEffect(() => {
    function getIfExistStoredChatRoom() {
      if (!existStoredChatRoom?.messageId) {
        const condition = where('member', 'in', [[...allChatters]])
        getAllCollectionDocs('chatRoomInfo', condition).then((docData) => setExistStoredChatRoom(docData[0]))
      }
    }
    getIfExistStoredChatRoom()
  }, [allChatters, existStoredChatRoom?.messageId, setExistStoredChatRoom])

  useEffect(() => {
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
      resetIsOpenChooseChatters()
      resetSelectedChatter()
      resetExistStoredChatRoom()
    }
  }, [resetIsOpenChatRoom, resetIsOpenChooseChatters, resetExistStoredChatRoom, resetSelectedChatter, isOpenChatRoom])

  const handleInputMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.currentTarget.value)
  }

  const handleCloseButtonClick = () => {
    setIsOpenChatRoom(false)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!e.shiftKey && e.key === 'Enter') {
      e.preventDefault()
      handleMessageSubmit()
    }
  }

  useEffect(() => {
    if (messageInfoDoc) document.querySelector('#scroll')?.scrollIntoView(false)
  }, [messageInfoDoc])

  const handleMessageSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    setInputMessage('')
    const messageInfoData = createMessageInfoData(inputMessage, displayName, uid, time)

    if (existStoredChatRoom?.messageId) {
      await updateDocs('messageInfo', existStoredChatRoom.messageId, messageInfoData)
      updateDocs('chatRoomInfo', existStoredChatRoom.chatRoomId, { lastMessage: { text: inputMessage, time } })
    } else {
      const messageRef = await createDocsWithAutoId('messageInfo', messageInfoData)
      const chatRoomInfoData = createChatRoomInfoData(allChatters, time, messageRef?.id, '')
      const chatRoomRef = await createDocsWithAutoId('chatRoomInfo', chatRoomInfoData)
      chatRoomRef &&
        updateDocs('chatRoomInfo', chatRoomRef?.id, {
          chatRoomId: chatRoomRef?.id,
          lastMessage: { text: inputMessage, time },
        })
      chatRoomRef &&
        getSpecificDocs('chatRoomInfo', chatRoomRef?.id).then((docData) => setExistStoredChatRoom(docData.data()))
    }
  }

  return (
    <div className={styles.chatRoom}>
      <Header
        title={selectedChatterNickNames.join(',') || makeChatRoomTitle(existStoredChatRoom?.member, uid) || '내 채팅방'}
      >
        <HeaderButton title='채팅방 닫기' handleButtonClick={handleCloseButtonClick} />
      </Header>
      <ul className={styles.chatScreen}>
        {messageInfoDoc?.messages?.map((message: DocumentData, index: number) => {
          const {
            sender: { nickName, uid: senderId },
            text,
            time: sentTime,
          } = message
          const messageInfoKey = `messageInfo-${index}`
          const isMyMessage = senderId === uid
          const prevMessageInfo = messageInfoDoc?.messages[index - 1]
          const nextMessageInfo = messageInfoDoc?.messages[index + 1]
          const newDay = !index ? firstDay(sentTime) : newDayStart(prevMessageInfo?.time, sentTime)
          const sameNextTime = sameHourMinute(sentTime, nextMessageInfo?.time)

          return (
            <li key={messageInfoKey} className={styles.messageItem}>
              {newDay && <p className={styles.newDate}>{newDay}</p>}
              <div
                className={cx(styles.messageBox, {
                  [styles.myMessageBox]: isMyMessage,
                })}
              >
                {!isMyMessage && senderId !== prevMessageInfo?.sender.uid && (
                  <p className={styles.nickName}>{nickName}</p>
                )}
                <div>
                  {isMyMessage && !sameNextTime && <p className={styles.sentTime}>{dayNightTime(sentTime)}</p>}
                  <p
                    className={cx(styles.text, {
                      [styles.myText]: isMyMessage,
                    })}
                  >
                    {manageLineChange(text)}
                  </p>
                  {!isMyMessage && !sameNextTime && <p className={styles.sentTime}>{dayNightTime(sentTime)}</p>}
                </div>
              </div>
            </li>
          )
        })}
        <div id='scroll' />
      </ul>
      <form className={styles.form} onSubmit={handleMessageSubmit}>
        <textarea name='text' value={inputMessage} onChange={handleInputMessageChange} onKeyDown={handleInputKeyDown} />
        <button type='submit'>전송</button>
      </form>
    </div>
  )
}

export default ChatRoom
