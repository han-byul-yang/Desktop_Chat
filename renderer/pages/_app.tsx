import type { AppProps } from 'next/app'

import Layout from 'components/Layout'

import '../styles/global.scss'

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default App
