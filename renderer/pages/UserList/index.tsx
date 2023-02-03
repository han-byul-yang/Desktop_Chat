import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DocumentData } from 'firebase/firestore'

import { UserStateContext } from 'pages/_app'
import { getAllCollectionDocs } from 'services/firebaseService/firebaseDBService'
import { IUserInfo } from 'types/dbDocType'
import Header from 'components/Header'
import ProfileBox from 'components/ProfileBox'

import styles from './userList.module.scss'

const UserList = () => {
  const [userInfoDocList, setUserInfoDocList] = useState<DocumentData[]>([])
  const [selectedUser, setSelectedUser] = useState(0)
  const [isOpenProfile, setIsOpenProfile] = useState(false)
  const userAuthState = useContext(UserStateContext)
  const navigate = useRouter()

  useEffect(() => {
    if (!userAuthState) navigate.push('/SignIn')
  }, [navigate, userAuthState])

  useEffect(() => {
    getAllCollectionDocs('userInfo').then((docData) => setUserInfoDocList(docData))
  }, [])

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
        <ProfileBox selectedUserInfo={userInfoDocList[selectedUser]} setIsOpenProfile={setIsOpenProfile} />
      )}
    </>
  )
}

export default UserList
