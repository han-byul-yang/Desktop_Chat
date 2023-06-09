import { DocumentData, arrayUnion } from 'firebase/firestore'

export const createChatRoomInfoData = (
  member: DocumentData[],
  time: number,
  messageId: string | undefined,
  lastMessage: string
) => {
  const chatRoomObject = {
    member,
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
  const userObject = {
    uid,
    email,
    nickName,
  }
  return userObject
}
