import { useState, useEffect, ChangeEvent } from 'react'
import { getAuth } from 'firebase/auth'
import { DocumentData, where } from 'firebase/firestore'
import { useSetRecoilState } from 'recoil'

import { getAllCollectionDocs } from 'service/firebaseService/firebaseDBService'
import useResetAtom from 'hooks/useResetAtom'
import { isOpenChatRoomAtom, isOpenChooseChattersAtom, selectedChattersAtom } from 'Store/docInfoAtom'
import Header from 'components/Header'
import HeaderButton from 'components/HeaderButton'

import styles from './chooseChatters.module.scss'

const ChooseChatters = () => {
  const myUid = getAuth().currentUser?.uid
  const selectedUsers = new Set()
  const [othersInfoDocList, setOthersInfoDocList] = useState<DocumentData[]>([])
  const setIsOpenChooseChatters = useSetRecoilState(isOpenChooseChattersAtom)
  const setIsOpenChatRoom = useSetRecoilState(isOpenChatRoomAtom)
  const setSelectedChatters = useSetRecoilState(selectedChattersAtom)
  const { resetSelectedChatter, resetExistStoredChatRoom } = useResetAtom()

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    const condition = where('uid', "!=", myUid)
    getAllCollectionDocs('userInfo', condition).then((docData) => {
      setOthersInfoDocList(docData)
    })
  }, [myUid])

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
      const { uid, nickName } = othersInfoDocList[numId]
      setSelectedChatters((prevState) => (!prevState[0].uid ? [{ uid, nickName }] : [...prevState, { uid, nickName }]))
    })
    resetExistStoredChatRoom()
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
        {othersInfoDocList.map((docData, index) => {
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
