/* eslint-disable import/no-extraneous-dependencies */
import { FirebaseError } from 'firebase/app'
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc } from 'firebase/firestore'

import { firebaseDBService } from './firebaseSetting'
import { IUserInfo } from 'types/dbDocType'

export const createDocsWithAuthId = async (collectionName: string, data: any) => {
  return addDoc(collection(firebaseDBService, collectionName), data).catch((error) => {
    if (error instanceof FirebaseError) throw new Error(error.code)
  })
}

export const createDocsWithSpecificId = async (collectionName: string, docId: string, data: IUserInfo) => {
  await setDoc(doc(firebaseDBService, collectionName, docId), data).catch((error) => {
    if (error instanceof FirebaseError) throw Error()
  })
}

export const updateDocsToFirebase = async (collectionName: string, docName: string, data: any) => {
  return updateDoc(doc(firebaseDBService, collectionName, docName), { data }).catch((error) => {
    if (error instanceof FirebaseError) throw new Error()
  })
}

export const getDocsFromFirebase = async (collectionName: string, docName: string) => {
  // const collectionQuery = query(collection(firebaseDBService, collectionName))
  // const docs = await getDocs(collectionQuery)
  const docRef = doc(firebaseDBService, collectionName, docName)
  const docs = await getDoc(docRef)

  return docs
}
