/* eslint-disable import/no-extraneous-dependencies */
import { useState, useContext, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import { getAuth } from 'firebase/auth'
import { DocumentData, where } from 'firebase/firestore'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'

import { AuthStateContext } from 'pages/_app'
import { getAllCollectionDocs } from 'services/firebaseService/firebaseDBService'
import {
  isOpenChatRoomAtom,
  isOpenChooseChattersAtom,
  myInfoDocAtom,
  selectedChatRoomAtom,
  selectedChatterAtom,
} from 'Store/docInfoAtom'
import Header from 'components/Header'
import HeaderButton from 'components/HeaderButton'

import styles from './chooseChatters.module.scss'

const ChooseChatters = () => {
  const userAuthInfo = getAuth().currentUser
  const selectedUsers = new Set()
  const [userInfoDocList, setUserInfoDocList] = useState<DocumentData[]>([])
  // const [myInfoDoc, setMyInfoDoc] = useState<DocumentData>({})
  const [myInfoDoc, setMyInfoDoc] = useRecoilState(myInfoDocAtom)
  const [selectedUser, setSelectedUser] = useState(0)
  const userAuthState = useContext(AuthStateContext)
  const navigate = useRouter()
  const setIsOpenChooseChatters = useSetRecoilState(isOpenChooseChattersAtom)
  const setIsOpenChatRoom = useSetRecoilState(isOpenChatRoomAtom)
  const [selectedChatter, setSelectedChatter] = useRecoilState(selectedChatterAtom)
  const resetSelectedChatRoom = useResetRecoilState(selectedChatRoomAtom)
  const resetSelectedChatter = useResetRecoilState(selectedChatterAtom)

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    const condition = where('uid', "!=", userAuthInfo?.uid)
    getAllCollectionDocs('userInfo', condition).then((docData) => {
      setUserInfoDocList(docData)
    })
  }, [userAuthInfo?.uid])

  useEffect(() => {
    resetSelectedChatter()
  }, [resetSelectedChatter])

  const handleCloseClick = () => {
    setIsOpenChooseChatters(false)
  }

  const handleSelectUserClick = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target
    if (checked) selectedUsers.add(id)
    if (!checked && selectedUsers.has(id)) selectedUsers.delete(id)
  }

  const handleCreateChatRoomClick = () => {
    if (!selectedUsers.size) return
    selectedUsers.forEach((id) => {
      const numId = Number(id)
      const { uid, nickName } = userInfoDocList[numId]
      setSelectedChatter((prevState) => (!prevState[0].uid ? [{ uid, nickName }] : [...prevState, { uid, nickName }]))
    })
    resetSelectedChatRoom()
    setIsOpenChooseChatters(false)
    setIsOpenChatRoom(true)
  }

  return (
    <div className={styles.chooseChatters}>
      <Header title='채팅 선택 유저 리스트'>
        <HeaderButton title='방 생성' handleButtonClick={handleCreateChatRoomClick} />
        <HeaderButton title='닫기' handleButtonClick={handleCloseClick} />
      </Header>

      <ul className={styles.userList}>
        {userInfoDocList.map((docData, index) => {
          const docDataKey = `docData-${index}`

          return (
            <li key={docDataKey}>
              <label className={styles.userNickName} htmlFor={`${index}`}>
                {docData.nickName}
              </label>
              <label className={styles.checkbox} htmlFor={`${index}`} />

              <input
                type='checkbox'
                id={`${index}`}
                name={`${index}`}
                value={docData.uid}
                onChange={(e) => handleSelectUserClick(e)}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ChooseChatters
