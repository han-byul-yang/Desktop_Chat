/* eslint-disable import/no-extraneous-dependencies */
import { ReactElement, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'

import { AuthStateContext } from 'pages/_app'
import { signInAuth } from 'services/firebaseService/firebaseAuthService'
import { errorMessages } from 'constants/errorMessages'
import AuthContainer from 'components/AuthContainer'
import AuthLayout from 'components/Layout/AuthLayout'

const SignIn = () => {
  const userAuthState = useContext(AuthStateContext)
  const navigate = useRouter()

  useEffect(() => {
    if (userAuthState) navigate.push('/UserList')
  }, [navigate, userAuthState])

  const handleAuthSubmit = async (email: string, password: string) => {
    try {
      await signInAuth(email, password)
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case errorMessages['auth/email-already-in-use']:
            console.log(error.message)
            break
          case errorMessages['auth/user-not-found']:
            console.log(error.message)
            break
          case errorMessages['auth/wrong-password']:
            console.log(error.message)
            break
          default:
            console.log(errorMessages['auth/something-went-wrong'])
        }
      }
    }
  }

  return <AuthContainer type='signIn' handleAuthSubmit={handleAuthSubmit} />
}

SignIn.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default SignIn
