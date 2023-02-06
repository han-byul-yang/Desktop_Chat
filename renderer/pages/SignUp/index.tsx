/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { AuthStateContext } from 'pages/_app'
import { createUserInfoData } from 'utils/InfoDataForStore'
import { createDocsWithSpecificId } from 'services/firebaseService/firebaseDBService'
import { signUpAuth, updateNickName } from 'services/firebaseService/firebaseAuthService'
import { errorMessages } from 'constants/errorMessages'
import AuthContainer from 'components/AuthContainer'

const SignUp = () => {
  const userAuthState = useContext(AuthStateContext)
  const navigate = useRouter()

  useEffect(() => {
    if (userAuthState) navigate.push('/UserList')
  }, [navigate, userAuthState])

  const handleAuthSubmit = async (email: string, password: string, nickName: string) => {
    try {
      await signUpAuth(email, password).then((auth) => {
        const userInfoData = createUserInfoData(auth!.user.uid, email, nickName)
        createDocsWithSpecificId('userInfo', auth!.user.uid, userInfoData)
      })
      await updateNickName(nickName)
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case errorMessages['auth/email-already-in-use']:
            console.log(error.message)
            break
          case errorMessages['auth/weak-password']:
            console.log(error.message)
            break
        }
      }
    }
  }

  return <AuthContainer type='signUp' handleAuthSubmit={handleAuthSubmit} />
}

export default SignUp
