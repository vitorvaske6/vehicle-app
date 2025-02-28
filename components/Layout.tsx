import { ReactNode } from 'react'
import AppNavbar from './Navbar'
import Footer from './Footer'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useRouter()
  const authPages = ['/login', '/register']
  const showNavbar = !authPages.includes(pathname)

  return (
    <div className="main-content text-foreground bg-background page-container">
      {showNavbar && <AppNavbar />}
      <main className="purple-dark">{children}</main>
      {showNavbar && <Footer />}
    </div>
  )
}