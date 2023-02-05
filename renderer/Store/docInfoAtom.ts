/* eslint-disable import/no-extraneous-dependencies */
import { atom } from 'recoil'

import { DocumentData } from 'firebase/firestore'

import { IUserInfo } from 'types/dbDocType'

export const myAuthUidAtom = atom({
  key: 'myAuthUid',
  default: '',
})

export const myInfoDocAtom = atom<DocumentData>({
  key: 'myInfoDoc',
  default: { uid: '', nickName: '', email: '', chatRoom: [] },
})

export const selectedChatterAtom = atom({
  key: 'selectedChatter',
  default: [{ uid: '', nickName: '' }],
})

export const isOpenChatRoomAtom = atom({
  key: 'isOpenChatRoom',
  default: false,
})

export const tempMyChatRoomsAtom = atom({
  key: 'tempMyChatRooms',
  default: [],
})

export const selectedChatRoomAtom = atom<DocumentData | undefined>({
  key: 'selectedChatRoom',
  default: {},
})

export const isOpenChooseChattersAtom = atom({
  key: 'isOpenChooseChatters',
  default: false,
})
