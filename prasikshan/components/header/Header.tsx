'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      style={{
        backgroundColor: '#124D96',
        color: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
      }}
    >
      <div
        style={{
          height: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '80px',
          paddingRight: '80px',
        }}
      >
        {/* Logo */}
        <div
          style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '24px' }}
          onClick={() => router.push('/')}
        >
          Prashikshan
        </div>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex gap-6 items-center"
          style={{ fontSize: '14px' }}
        >
          <a
            onClick={() => router.push('/')}
            style={{ cursor: 'pointer', color: 'white', textDecoration: 'none' }}
          >
            Home
          </a>
          <a
            onClick={() => router.push('/aboutssb')}
            style={{ cursor: 'pointer', color: 'white', textDecoration: 'none' }}
          >
            About SSB
          </a>
          <button
            onClick={() => router.push('/signin')}
            style={{
              backgroundColor: '#00FF11',
              borderRadius: '5px',
              color: 'black',
              padding: '8px 40px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            SignIn
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.8rem',
              cursor: 'pointer',
            }}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          style={{
            backgroundColor: '#124D96',
            display: 'flex',
            flexDirection: 'column',
            padding: '10px 20px',
          }}
        >
          <a
            onClick={() => {
              router.push('/');
              setIsOpen(false);
            }}
            style={{
              padding: '10px 0',
              borderBottom: '1px solid #1E5CA8',
              cursor: 'pointer',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Home
          </a>
          <a
            onClick={() => {
              router.push('/aboutssb');
              setIsOpen(false);
            }}
            style={{
              padding: '10px 0',
              borderBottom: '1px solid #1E5CA8',
              cursor: 'pointer',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            About SSB
          </a>
          <a
            onClick={() => {
              router.push('/signin');
              setIsOpen(false);
            }}
            style={{
              padding: '10px 0',
              borderBottom: '1px solid #1E5CA8',
              cursor: 'pointer',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            SignIn
          </a>
        </div>
      )}
    </header>
  );
}
