/* eslint-disable import/no-extraneous-dependencies */
import { useRouter } from 'next/router'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { firebaseAuthService } from 'services/firebaseService/firebaseSetting'
import { errorMessages } from 'constants/errorMessages'
import AuthContainer from 'components/AuthContainer'

const SignIn = () => {
  const navigate = useRouter()

  const handleAuthSubmit = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(firebaseAuthService, email, password)
        .then(() => navigate.push('/UserList'))
        .catch((error) => {
          if (error instanceof FirebaseError) throw new Error(error.code)
        })
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

export default SignIn
