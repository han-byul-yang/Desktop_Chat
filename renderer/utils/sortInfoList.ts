import { DocumentData } from 'firebase/firestore'

export const sortChattersByNickName = (list: { uid: string | undefined; nickName: string | null | undefined }[]) => {
  const sortedChatters = list.sort((a, b) => {
    if (a && a.uid && b && b.uid) {
      if (a.uid > b.uid) return -1
      if (a.uid < b.uid) return 1
    }
    return 0
  })
  return sortedChatters
}

export const sortChatRoomsByTime = (chatRoomsInfoDocs: (DocumentData | undefined)[]) => {
  const sortedChatRooms = chatRoomsInfoDocs.sort((a, b) => {
    if (a && b) {
      const bTime = Number(b.lastMessage.time)
      const aTime = Number(a.lastMessage.time)
      if (bTime > aTime) return 1
      if (bTime < aTime) return -1
    }
    return 0
  })

  return sortedChatRooms
}
