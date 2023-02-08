/* eslint-disable import/no-extraneous-dependencies */
import { ReactElement, ReactNode, createContext, useState } from 'react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { getAuth } from 'firebase/auth'

import { firebaseAuthService } from 'services/firebaseService/firebaseSetting'
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

  const renderWithLayout =
    Component.getLayout ||
    function specificLayout(page) {
      return <MainLayout>{page}</MainLayout>
    }

  firebaseAuthService.onAuthStateChanged((state) => {
    if (state) {
      setIsLogin(true)
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
