import { Dispatch } from 'react'
import { FirebaseError } from 'firebase/app'
import {
  DocumentData,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { firebaseDBService } from './firebaseSetting'
import { IUserInfoType } from 'types/dbDocType'

export const createDocsWithAutoId = async (collectionName: string, data: any) => {
  return addDoc(collection(firebaseDBService, collectionName), data).catch((error) => {
    if (error instanceof FirebaseError) throw new Error(error.code)
  })
}

export const createDocsWithSpecificId = async (collectionName: string, docId: string, data: IUserInfoType) => {
  return setDoc(doc(firebaseDBService, collectionName, docId), data).catch((error) => {
    if (error instanceof FirebaseError) throw Error()
  })
}

export const updateDocs = async (collectionName: string, docId: string, data: any) => {
  return updateDoc(doc(firebaseDBService, collectionName, docId), data).catch((error) => {
    if (error instanceof FirebaseError) throw new Error()
  })
}

export const getAllCollectionDocs = async (collectionName: string, condition?: QueryFieldFilterConstraint) => {
  const docsList: DocumentData[] = []
  const q = condition
    ? query(collection(firebaseDBService, collectionName), condition)
    : query(collection(firebaseDBService, collectionName))

  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((docData: QueryDocumentSnapshot<DocumentData>) => {
    docsList.push(docData.data())
  })

  return docsList
}

export const getSpecificDocs = async (collectionName: string, docId: string) => {
  const docRef = doc(firebaseDBService, collectionName, docId)
  const docs = await getDoc(docRef)

  return docs
}

export const onSnapShotAllCollectionDocs = (
  collectionName: string,
  condition: QueryFieldFilterConstraint,
  handleFunc: Dispatch<(DocumentData | undefined)[]>
) => {
  const q = query(collection(firebaseDBService, collectionName), condition)
  const unSubscribe = onSnapshot(q, (docData) => {
    const docsList: DocumentData[] = []

    docData.forEach((data) => docsList.push(data.data()))

    handleFunc(docsList)
  })
  return unSubscribe
}

export const onSnapShotSpecificDocs = (
  collectionName: string,
  docId: string,
  handleFunc: Dispatch<DocumentData | undefined>
) => {
  const unSubscribe = onSnapshot(doc(firebaseDBService, collectionName, docId), (docData) => handleFunc(docData.data()))

  return unSubscribe
}
