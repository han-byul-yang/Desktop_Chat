import { signInAuth } from 'services/firebaseService/firebaseAuthService'
import { errorMessages } from 'constants/errorMessages'
import AuthContainer from 'components/AuthContainer'

const SignIn = () => {
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

export default SignIn
