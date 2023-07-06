import React from 'react'
import { Disclosure } from '@headlessui/react'
import ConnectWallet from 'components/Connect/ConnectWallet'

import logo from 'assets/img/logo.png'
import {Link} from 'react-router-dom'

export default function Header() {
  return (
    <Disclosure as="nav" className="bg-transparent">
      <div className="mx-auto max-w-[3840px]">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/">
                <img className="block h-10 w-auto lg:hidden" src={logo} alt="Collabeat" />
                <img className="hidden h-10 w-auto lg:block" src={logo} alt="Collabeat" />
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center gap-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
