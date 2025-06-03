'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { Button } from '@/components/ui/Button'

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, profile, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'CV Manager', href: '/cv', icon: DocumentTextIcon },
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  ]

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-xl font-bold text-gray-900">NiceJob</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {user && (
              <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            )}

            {/* User Menu / Auth Buttons */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />
              ) : user ? (
                <>
                  {/* User Menu */}
                  <Menu as="div" className="relative">
                    <MenuButton className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name || 'User'}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <UserCircleIcon className="w-8 h-8" />
                      )}
                      <span className="hidden sm:block text-sm font-medium">
                        {profile?.full_name || 'User'}
                      </span>
                    </MenuButton>

                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              href="/settings"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } flex items-center space-x-2 px-4 py-2 text-sm text-gray-700`}
                            >
                              <Cog6ToothIcon className="h-4 w-4" />
                              <span>Settings</span>
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={handleSignOut}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700`}
                            >
                              <ArrowRightOnRectangleIcon className="h-4 w-4" />
                              <span>Sign Out</span>
                            </button>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>

                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    {isMobileMenuOpen ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </button>
                </>
              ) : (
                /* Auth Buttons */
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => openAuthModal('signin')}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => openAuthModal('signup')}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  )
} 