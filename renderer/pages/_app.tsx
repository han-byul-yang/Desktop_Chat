import { createContext, useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { getAuth } from 'firebase/auth'

import { firebaseAuthService } from 'services/firebaseService/firebaseSetting'
import { myAuthUidAtom } from 'Store/docInfoAtom'
import Layout from 'components/Layout'

import '../styles/global.scss'

export const AuthStateContext = createContext(false)
export const MyUidContext = createContext('')

const App = ({ Component, pageProps }: AppProps) => {
  const auth = getAuth()
  const [isLogin, setIsLogin] = useState(!!auth.currentUser)
  const [myUid, setMyUid] = useState('')

  firebaseAuthService.onAuthStateChanged((state) => {
    if (state) {
      setIsLogin(true)
      if (auth.currentUser) setMyUid(auth.currentUser.uid)
    } else {
      setIsLogin(false)
    }
  })

  return (
    <RecoilRoot>
      <AuthStateContext.Provider value={isLogin}>
        <MyUidContext.Provider value={myUid}>
          <Layout isLogin={isLogin}>
            <Component {...pageProps} />
          </Layout>
        </MyUidContext.Provider>
      </AuthStateContext.Provider>
    </RecoilRoot>
  )
}

export default App
