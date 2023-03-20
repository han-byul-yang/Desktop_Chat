export interface IUserInfoType {
  uid: string
  email: string
  nickName: string
}

export interface IChatRoomInfoType {
  member: (string | undefined)[]
  time: number
  messageId: string | undefined
  lastMessage: string
}

export interface IMessagesInfoType {
  messages: {
    text: string
    sender: { nickName: string | null | undefined; uid: string | undefined }
    time: number
  }[]
}
