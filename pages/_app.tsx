import {HeroUIProvider} from "@heroui/react";
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <HeroUIProvider>
        {/* Layout will handle navbar visibility */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </HeroUIProvider>
    </SessionProvider>
  )
}
export default MyApp