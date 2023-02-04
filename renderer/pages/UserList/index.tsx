/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { getAuth } from 'firebase/auth'
import { DocumentData } from 'firebase/firestore'

import { AuthStateContext } from 'pages/_app'
import { getAllCollectionDocs, getSpecificDocs } from 'services/firebaseService/firebaseDBService'
import { IUserInfo } from 'types/dbDocType'
import { myInfoDocAtom } from 'Store/docInfoAtom'
import Header from 'components/Header'
import ProfileBox from 'components/ProfileBox'

import styles from './userList.module.scss'

const UserList = () => {
  const [userInfoDocList, setUserInfoDocList] = useState<DocumentData[]>([])
  // const [myInfoDoc, setMyInfoDoc] = useState<DocumentData>({})
  const [myInfoDoc, setMyInfoDoc] = useRecoilState(myInfoDocAtom)
  const [selectedUser, setSelectedUser] = useState(0)
  const [isOpenProfile, setIsOpenProfile] = useState(false)
  const auth = getAuth()
  const userAuthState = useContext(AuthStateContext)
  const navigate = useRouter()

  useEffect(() => {
    if (!userAuthState) navigate.push('/SignIn')
  }, [navigate, userAuthState])

  useEffect(() => {
    getAllCollectionDocs('userInfo').then((docData) => {
      setMyInfoDoc(docData.filter((userData) => userData.uid === auth.currentUser?.uid)[0])
      setUserInfoDocList(docData)
    })
  }, [auth.currentUser, auth.currentUser?.uid, setMyInfoDoc])

  const handleUserClick = (index: number) => {
    setSelectedUser(index)
    setIsOpenProfile(true)
  }

  return (
    <>
      <Header title='유저 목록' />
      <ul className={styles.userList}>
        {userInfoDocList.map((docData, index) => {
          const docDataKey = `docData-${index}`

          return (
            <li key={docDataKey}>
              <button type='button' onClick={() => handleUserClick(index)}>
                {docData.nickName}
              </button>
            </li>
          )
        })}
      </ul>
      {isOpenProfile && (
        <ProfileBox
          myInfoDoc={myInfoDoc}
          selectedUserInfoDoc={userInfoDocList[selectedUser]}
          setIsOpenProfile={setIsOpenProfile}
        />
      )}
    </>
  )
}

export default UserList
