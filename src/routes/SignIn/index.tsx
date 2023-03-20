/* eslint-disable import/no-extraneous-dependencies */
import { ReactElement, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

// import { AuthStateContext } from 'pages/_app'
import { signInAuth } from 'service/firebaseService/firebaseAuthService'
import { errorMessageAtom } from 'Store/docInfoAtom'
import { errorMessages } from 'constants/errorMessages'
import AuthContainer from 'components/AuthContainer'

const SignIn = () => {
  const setErrorMessage = useSetRecoilState(errorMessageAtom)
  // const userAuthState = useContext(AuthStateContext)
  const navigate = useNavigate()

  useEffect(() => {
    // if (userAuthState) navigate('/UserList')
  }, [navigate])

  const handleAuthSubmit = async (email: string, password: string) => {
    try {
      // eslint-disable-next-line no-return-assign
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
