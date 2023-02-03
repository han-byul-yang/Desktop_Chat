import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'

import { firebaseAuthService } from './firebaseSetting'

export const signUpAuth = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(firebaseAuthService, email, password).catch((error) => {
    if (error instanceof FirebaseError) throw new Error(error.code)
  })
}

export const signInAuth = async (email: string, password: string) => {
  return signInWithEmailAndPassword(firebaseAuthService, email, password).catch((error) => {
    if (error instanceof FirebaseError) throw new Error(error.code)
  })
}

// eslint-disable-next-line consistent-return
export const updateNickName = async (nickName: string) => {
  if (firebaseAuthService && firebaseAuthService.currentUser)
    return updateProfile(firebaseAuthService.currentUser, { displayName: nickName }).catch((error) => {
      if (error instanceof FirebaseError) throw new Error(error.code)
    })
}
