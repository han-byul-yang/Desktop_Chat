import { useResetRecoilState } from 'recoil'

import {
  existStoredChatRoomAtom,
  selectedChattersAtom,
  isOpenChatRoomAtom,
  isOpenChooseChattersAtom,
} from 'Store/docInfoAtom'

const useResetAtom = () => {
  const resetExistStoredChatRoom = useResetRecoilState(existStoredChatRoomAtom)
  const resetSelectedChatter = useResetRecoilState(selectedChattersAtom)
  const resetIsOpenChatRoom = useResetRecoilState(isOpenChatRoomAtom)
  const resetIsOpenChooseChatters = useResetRecoilState(isOpenChooseChattersAtom)

  return { resetExistStoredChatRoom, resetSelectedChatter, resetIsOpenChatRoom, resetIsOpenChooseChatters }
}

export default useResetAtom
