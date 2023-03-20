import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'

import { firebaseAuthService } from 'service/firebaseService/firebaseSetting'
import AuthLayout from 'components/Layout/AuthLayout'
import MainLayout from 'components/Layout/MainLayout'
import ChatRoomContainer from './ChatRoomContainer'
import UserList from './UserList'
import SignIn from './SignIn'
import SignUp from './SignUp'

const App = () => {
  const [isLoggin, setIsLoggin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    onAuthStateChanged(firebaseAuthService, (user) => {
      setIsLoading(true)
      if (user) {
        setIsLoggin(true)
      } else {
        setIsLoggin(false)
      }
      setIsLoading(false)
    })
  }, [])

  return isLoading ? (
    <div>loading...</div>
  ) : (
    <Routes>
      {isLoggin ? (
        <Route element={<MainLayout />}>
          <Route path='/' element={<UserList />} />
          <Route path='chatRoom' element={<ChatRoomContainer />} />
        </Route>
      ) : (
        <Route element={<AuthLayout />}>
          <Route path='/' element={<SignIn />} />
          <Route path='signUp' element={<SignUp />} />
        </Route>
      )}
    </Routes>
  )
}

export default App
