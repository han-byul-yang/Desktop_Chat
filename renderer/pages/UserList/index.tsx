import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DocumentData } from 'firebase/firestore'

import { UserStateContext } from 'pages/_app'
import { getAllCollectionDocs } from 'services/firebaseService/firebaseDBService'
import { IUserInfo } from 'types/dbDocType'
import Header from 'components/Header'

import styles from './userList.module.scss'

const UserList = () => {
  const [userInfoDocList, setUserInfoDocList] = useState<DocumentData[]>([])
  const userAuthState = useContext(UserStateContext)
  const navigate = useRouter()

  useEffect(() => {
    getAllCollectionDocs('userInfo').then((docData) => setUserInfoDocList(docData))
  }, [])

  useEffect(() => {
    if (!userAuthState) navigate.push('/SignIn')
  }, [navigate, userAuthState])

  return (
    <>
      <Header title='유저 목록' />
      <ul className={styles.userList}>
        {userInfoDocList.map((docData, index) => {
          const docDataKey = `docData-${index}`

          return <li key={docDataKey}>{docData.nickName}</li>
        })}
      </ul>
    </>
  )
}

export default UserList
