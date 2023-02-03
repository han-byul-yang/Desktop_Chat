import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { UserStateContext } from 'pages/_app'
import { createDocsWithSpecificId } from 'services/firebaseService/firebaseDBService'
import { signUpAuth, updateNickName } from 'services/firebaseService/firebaseAuthService'
import { errorMessages } from 'constants/errorMessages'
import AuthContainer from 'components/AuthContainer'

const SignUp = () => {
  const userAuthState = useContext(UserStateContext)
  const navigate = useRouter()

  useEffect(() => {
    if (userAuthState) navigate.push('/UserList')
  }, [navigate, userAuthState])

  const handleAuthSubmit = async (nickName: string, email: string, password: string) => {
    try {
      await signUpAuth(email, password).then((auth) =>
        createDocsWithSpecificId('userInfo', auth!.user.uid, { uid: auth!.user.uid, email, nickName, chatRoom: [] })
      )
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
