/* eslint-disable import/no-extraneous-dependencies */
import { ReactElement, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSetRecoilState } from 'recoil'

import { AuthStateContext } from 'pages/_app'
import { createDocsWithSpecificId } from 'services/firebaseService/firebaseDBService'
import { signUpAuth, updateNickName } from 'services/firebaseService/firebaseAuthService'
import { errorMessageAtom } from 'Store/docInfoAtom'
import { errorMessages } from 'constants/errorMessages'
import AuthContainer from 'components/AuthContainer'
import AuthLayout from 'components/Layout/AuthLayout'

const SignUp = () => {
  const setErrorMessage = useSetRecoilState(errorMessageAtom)
  const userAuthState = useContext(AuthStateContext)
  const navigate = useRouter()

  useEffect(() => {
    if (userAuthState) navigate.push('/UserList')
  }, [navigate, userAuthState])

  const handleAuthSubmit = async (email: string, password: string, nickName: string) => {
    try {
      await signUpAuth(email, password).then((auth) => {
        createDocsWithSpecificId('userInfo', auth!.user.uid, { uid: auth!.user.uid, email, nickName })
      })
      await updateNickName(nickName!)
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case errorMessages['auth/email-already-in-use']:
            setErrorMessage(error.message)
            break
          case errorMessages['auth/weak-password']:
            setErrorMessage(error.message)
            break
        }
      }
    }
  }

  return <AuthContainer type='signUp' handleAuthSubmit={handleAuthSubmit} />
}

SignUp.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default SignUp
