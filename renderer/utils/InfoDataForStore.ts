import { arrayUnion } from 'firebase/firestore'
import { IUserInfoType } from 'types/dbDocType'

export const createChatRoomInfoData = (
  member: (string | undefined)[],
  time: number,
  messageId: string | undefined,
  lastMessage: string
) => {
  const chatRoomObject = {
    member: member.sort(),
    time,
    messageId,
    lastMessage,
  }
  return chatRoomObject
}

export const createMessageInfoData = (
  inputMessage: string,
  displayName: string | null | undefined,
  uid: string | undefined,
  time: number
) => {
  const messageObject = {
    messages: arrayUnion({
      text: inputMessage,
      sender: { nickName: displayName, uid },
      time,
    }),
  }
  return messageObject
}

export const createUserInfoData = (uid: string, email: string, nickName: string) => {
  const userObject: IUserInfoType = {
    uid,
    email,
    nickName,
  }
  return userObject
}
