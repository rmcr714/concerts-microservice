import React from 'react'
import Link from 'next/link'

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: currentUser.email, href: '/' },
    currentUser && { label: 'Sign out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => (
      <>
        <li key={href} className='nav-item' style={{ color: 'white' }}>
          <Link href={href} className='link'>
            <a className='nav-link link'>{label}</a>
          </Link>
        </li>
        &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
      </>
    ))

  return (
    <nav className='navbar navbar-dark bg-primary ml-3 mr-1'>
      <Link href='/'>
        <a className='navbar-brand'>&nbsp;&nbsp;Concertify</a>
      </Link>
      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>{links}</ul>
      </div>
    </nav>
  )
}

export default Header
