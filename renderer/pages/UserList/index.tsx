/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { getAuth } from 'firebase/auth'
import { DocumentData } from 'firebase/firestore'

import { AuthStateContext } from 'pages/_app'
import { getAllCollectionDocs } from 'services/firebaseService/firebaseDBService'
import Header from 'components/Header'
import ProfileBox from 'components/ProfileBox'

import styles from './userList.module.scss'

const UserList = () => {
  const [userInfoDocs, setUserInfoDocs] = useState<DocumentData[]>([])
  const [selectedUser, setSelectedUser] = useState(0)
  const [isOpenProfile, setIsOpenProfile] = useState(false)
  const myUid = getAuth().currentUser?.uid
  const myInfoDoc = useRef<DocumentData>({})
  const othersInfoDoc = useRef<DocumentData[]>([])
  const userAuthState = useContext(AuthStateContext)
  const navigate = useRouter()

  useEffect(() => {
    if (!userAuthState) navigate.push('/SignIn')
  }, [navigate, userAuthState])

  useEffect(() => {
    getAllCollectionDocs('userInfo').then((docData) => {
      myInfoDoc.current = docData.filter((userData) => userData.uid === myUid)[0]
      othersInfoDoc.current = docData.filter((userData) => userData.uid !== myUid)
      setUserInfoDocs([myInfoDoc.current, ...othersInfoDoc.current])
    })
  }, [myUid, myInfoDoc])

  const handleUserClick = (index: number) => {
    setSelectedUser(index)
    setIsOpenProfile(true)
  }

  return (
    <>
      <Header title='유저 목록' />
      <ul className={styles.userList}>
        <p>내 프로필</p>
        <li>
          <button type='button' onClick={() => handleUserClick(0)}>
            {userInfoDocs[0]?.nickName}
          </button>
        </li>
        <p>유저 목록</p>
        {othersInfoDoc.current?.map((docData, index) => {
          const docDataKey = `docData-${index}`

          return (
            <li key={docDataKey}>
              <button type='button' onClick={() => handleUserClick(index + 1)}>
                {docData.nickName}
              </button>
            </li>
          )
        })}
      </ul>
      {isOpenProfile && (
        <ProfileBox selectedUserInfoDoc={userInfoDocs[selectedUser]} setIsOpenProfile={setIsOpenProfile} />
      )}
    </>
  )
}

export default UserList
