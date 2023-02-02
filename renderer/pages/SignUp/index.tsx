/* eslint-disable import/no-extraneous-dependencies */
import { useRouter } from 'next/router'
import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

import { firebaseAuthService } from 'services/firebaseService/firebaseSetting'
import { errorMessages } from 'constants/errorMessages'
import AuthContainer from 'components/AuthContainer'

const SignUp = () => {
  const navigate = useRouter()

  const handleAuthSubmit = async (nickName: string, email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(firebaseAuthService, email, password)
        .then(() => navigate.push('/UserList'))
        .catch((error) => {
          if (error instanceof FirebaseError) throw new Error(error.code)
        })
      updateProfile(firebaseAuthService.currentUser, {
        displayName: nickName,
      }).catch((error) => {
        if (error instanceof FirebaseError) throw new Error(error.code)
      })
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
