// eslint-disable-next-line import/no-extraneous-dependencies
import { NextApiRequest, NextApiResponse } from 'next'

import { firebaseAdminAuth } from 'services/firebaseService/firebaseAdmin'

export default function Auth(req: NextApiRequest, res: NextApiResponse) {
  const expiresIn = 5 * 60 * 60 * 1000
  const { userToken } = req.body

  if (req.method === 'POST') {
    firebaseAdminAuth
      .verifyIdToken(userToken)
      // eslint-disable-next-line consistent-return
      .then((decodedIdToken) => {
        if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 60 * 60) {
          return firebaseAdminAuth.createSessionCookie(userToken, { expiresIn })
        }
        res.status(401).send('인증시간이 만료되었습니다. 로그인을 다시 시도해주세요.')
      })
      .then((sessionCookie) => {
        if (sessionCookie) {
          const options = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: true,
            path: '/api/auth',
          }
          res.cookie('session', sessionCookie, options)
          res.status(200).end(JSON.stringify({ status: 'success' }))
        } else {
          res.status(401).send('Invalid authentication')
        }
      })
  }
}
