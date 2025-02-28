import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSession, signOut } from 'next-auth/react'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Veículos', href: '/vehicles' },
  { name: 'Perfil', href: '/profile' },
]

export default function AppNavbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <Navbar shouldHideOnScroll maxWidth="xl">
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          isIconOnly
          variant="light"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Brand Logo */}
      <NavbarBrand>
        <Link href="/" className="font-bold text-xl text-primary-600">
          VehicleTrack
        </Link>
      </NavbarBrand>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden md:flex gap-6" justify="center">
        {navigation.map((item) => (
          <NavbarItem key={item.name}>
            <Link
              href={item.href}
              className={`nav-link ${router.pathname === item.href ? 'active-nav-link' : ''
                }`}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white md:hidden shadow-lg z-50">
          <div className="px-4 py-2 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                block
                className={`p-2 nav-link ${router.pathname === item.href ? 'active-nav-link' : ''
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* User Profile Section */}
      <NavbarContent justify="end">
        {session?.user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  name={session.user.name || ''}
                  src={session.user.image || ''}
                  size="sm"
                />
                <span className="text-gray-600">{session.user.name}</span>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
              <DropdownItem key="profile" onClick={() => router.push('/profile')}>
                Meu Perfil
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Sair
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button
              color="primary"
              variant="flat"
              onClick={() => router.push('/login')}
            >
              Entrar
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  )
}