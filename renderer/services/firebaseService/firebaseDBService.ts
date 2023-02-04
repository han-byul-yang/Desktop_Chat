/* eslint-disable import/no-extraneous-dependencies */
import { Dispatch } from 'react'
import { FirebaseError } from 'firebase/app'
import {
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

import { IUserInfo } from 'types/dbDocType'
import { firebaseDBService } from './firebaseSetting'

export const createDocsWithAutoId = async (collectionName: string, data: any) => {
  return addDoc(collection(firebaseDBService, collectionName), data).catch((error) => {
    if (error instanceof FirebaseError) throw new Error(error.code)
  })
}

export const createDocsWithSpecificId = async (collectionName: string, docId: string, data: any) => {
  await setDoc(doc(firebaseDBService, collectionName, docId), data).catch((error) => {
    if (error instanceof FirebaseError) throw Error()
  })
}

export const updateDocs = async (collectionName: string, docId: string, data: any) => {
  return updateDoc(doc(firebaseDBService, collectionName, docId), data).catch((error) => {
    if (error instanceof FirebaseError) throw new Error()
  })
}

export const getAllCollectionDocs = async (collectionName: string) => {
  const docsList: DocumentData[] = []

  const querySnapshot = await getDocs(collection(firebaseDBService, collectionName))
  querySnapshot.forEach((docData: QueryDocumentSnapshot<DocumentData>) => {
    docsList.push(docData.data())
  })

  return docsList
}

export const getSpecificDocs = async (collectionName: string, docId: string) => {
  // const collectionQuery = query(collection(firebaseDBService, collectionName))
  // const docs = await getDocs(collectionQuery)
  const docRef = doc(firebaseDBService, collectionName, docId)
  const docs = await getDoc(docRef)

  return docs
}

export const onSnapShotAllCollectionDocs = (collectionName: string, uid: string, handleFunc: Dispatch<any>) => {
  // eslint-disable-next-line prettier/prettier
  const q = query(collection(firebaseDBService, collectionName), where("member", "array-contains", uid))
  const unSubscribe = onSnapshot(q, (docData) => {
    const myChatRoomsDocs: DocumentData[] = []

    docData.forEach((data) => myChatRoomsDocs.push(data.data()))

    handleFunc(myChatRoomsDocs)
  })
  return unSubscribe
}

// 공통 util로 만들기

export const onSnapShotSpecificDocs = (collectionName: string, docId: string, handleFunc: Dispatch<any>) => {
  const unSubscribe = onSnapshot(doc(firebaseDBService, collectionName, docId), (docData) => handleFunc(docData.data()))

  return unSubscribe
}
