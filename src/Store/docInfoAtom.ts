import { atom } from 'recoil'

import { DocumentData } from 'firebase/firestore'

export const selectedChattersAtom = atom({
  key: 'selectedChatter',
  default: [{ uid: '', nickName: '' }],
})

export const existStoredChatRoomAtom = atom<DocumentData | undefined>({
  key: 'existStoredChatRoom',
  default: {},
})

export const isOpenChatRoomAtom = atom({
  key: 'isOpenChatRoom',
  default: false,
})

export const isOpenChooseChattersAtom = atom({
  key: 'isOpenChooseChatters',
  default: false,
})

export const errorMessageAtom = atom({
  key: 'errorMessage',
  default: '',
})
