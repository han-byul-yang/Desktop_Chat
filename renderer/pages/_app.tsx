// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactElement, ReactNode, createContext, useState } from 'react'
import type { AppProps } from 'next/app'
import { RecoilRoot, useSetRecoilState } from 'recoil'
// eslint-disable-next-line import/no-extraneous-dependencies
import { NextPage } from 'next'
import { getAuth } from 'firebase/auth'

import { firebaseAuthService } from 'services/firebaseService/firebaseSetting'
import Layout from 'components/Layout'
import MainLayout from 'components/Layout/MainLayout'

import '../styles/global.scss'

export const AuthStateContext = createContext(false)

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const auth = getAuth()
  const [isLogin, setIsLogin] = useState(!!auth.currentUser)
  const [myUid, setMyUid] = useState('')

  const renderWithLayout =
    Component.getLayout ||
    function (page) {
      return <MainLayout>{page}</MainLayout>
    }

  firebaseAuthService.onIdTokenChanged((state) => {
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
        {renderWithLayout(<Component {...pageProps} />)}
      </AuthStateContext.Provider>
    </RecoilRoot>
  )
}

export default App
