import { createContext, useState } from 'react'
import type { AppProps } from 'next/app'
import { firebaseAuthService } from 'services/firebaseService/firebaseSetting'

import Layout from 'components/Layout'

import '../styles/global.scss'

export const UserStateContext = createContext(false)

const App = ({ Component, pageProps }: AppProps) => {
  const [isLogin, setIsLogin] = useState(false)

  firebaseAuthService.onAuthStateChanged((state) => {
    if (state) {
      setIsLogin(true)
    } else {
      setIsLogin(false)
    }
  })

  return (
    <UserStateContext.Provider value={isLogin}>
      <Layout isLogin={isLogin}>
        <Component {...pageProps} />
      </Layout>
    </UserStateContext.Provider>
  )
}

export default App
