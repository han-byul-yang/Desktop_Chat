import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { UserStateContext } from 'pages/_app'

const UserList = () => {
  const userAuthState = useContext(UserStateContext)
  const navigate = useRouter()

  useEffect(() => {
    if (!userAuthState) navigate.push('/SignIn')
  }, [navigate, userAuthState])

  return <div>userList</div>
}

export default UserList
