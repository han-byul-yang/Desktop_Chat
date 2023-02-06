const makeChatRoomTitle = (member: { uid: string; nickName: string }[], uid: string | undefined) => {
  const titleByMember = member
    // eslint-disable-next-line consistent-return, array-callback-return
    .filter((chatter: { uid: string; nickName: string }) => chatter.uid !== uid)
    .map((filteredChatter) => filteredChatter.nickName)
    .join(',')

  return titleByMember
}

export default makeChatRoomTitle
