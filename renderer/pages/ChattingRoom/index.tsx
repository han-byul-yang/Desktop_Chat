import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { UserStateContext } from 'pages/_app'

const ChattingRoom = () => {
  const userAuthState = useContext(UserStateContext)
  const navigate = useRouter()

  useEffect(() => {
    if (!userAuthState) navigate.push('/SignIn')
  }, [navigate, userAuthState])

  return <div>chatting Room</div>
}

export default ChattingRoom
