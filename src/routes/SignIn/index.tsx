import { useSetRecoilState } from 'recoil'

import { signInAuth } from 'service/firebaseService/firebaseAuthService'
import { errorMessageAtom } from 'Store/docInfoAtom'
import { errorMessages } from 'constants/errorMessages'
import AuthContainer from 'components/AuthContainer'

const SignIn = () => {
  const setErrorMessage = useSetRecoilState(errorMessageAtom)

  const handleAuthSubmit = async (email: string, password: string) => {
    try {
      await signInAuth(email, password)
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case errorMessages['auth/email-already-in-use']:
            setErrorMessage(error.message)
            break
          case errorMessages['auth/user-not-found']:
            setErrorMessage(error.message)
            break
          case errorMessages['auth/wrong-password']:
            setErrorMessage(error.message)
            break
          default:
            setErrorMessage(errorMessages['auth/something-went-wrong'])
        }
      }
    }
  }

  return <AuthContainer type='signIn' handleAuthSubmit={handleAuthSubmit} />
}

export default SignIn
