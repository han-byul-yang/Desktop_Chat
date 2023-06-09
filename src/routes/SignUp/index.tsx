import { useSetRecoilState } from 'recoil'

import { createDocsWithSpecificId } from 'service/firebaseService/firebaseDBService'
import { signUpAuth, updateNickName } from 'service/firebaseService/firebaseAuthService'
import { errorMessageAtom } from 'Store/docInfoAtom'
import { errorMessages } from 'constants/errorMessages'
import AuthContainer from 'components/AuthContainer'

const SignUp = () => {
  const setErrorMessage = useSetRecoilState(errorMessageAtom)

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

export default SignUp
