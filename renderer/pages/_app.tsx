// eslint-disable-next-line import/no-extraneous-dependencies
import { createContext, useState } from 'react'
import type { AppProps } from 'next/app'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { getAuth } from 'firebase/auth'

import { firebaseAuthService } from 'services/firebaseService/firebaseSetting'
import Layout from 'components/Layout'

import '../styles/global.scss'

export const AuthStateContext = createContext(false)

const App = ({ Component, pageProps }: AppProps) => {
  const auth = getAuth()
  const [isLogin, setIsLogin] = useState(!!auth.currentUser)
  const [myUid, setMyUid] = useState('')

  firebaseAuthService.onAuthStateChanged((state) => {
    if (state) {
      console.log('state', state)
      setIsLogin(true)
      if (auth.currentUser) setMyUid(auth.currentUser.uid)
    } else {
      console.log('noState', state)
      setIsLogin(false)
    }
  })

  return (
    <RecoilRoot>
      <AuthStateContext.Provider value={isLogin}>
        <Layout isLogin={isLogin}>
          <Component {...pageProps} />
        </Layout>
      </AuthStateContext.Provider>
    </RecoilRoot>
  )
}

export default App
