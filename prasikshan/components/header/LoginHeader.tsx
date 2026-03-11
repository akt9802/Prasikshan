'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

export default function LoginHeader() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleUserIconClick = () => {
    router.push('/userdetails');
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
          Prasikshan
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
          <a
            onClick={() => router.push('/ranking')}
            style={{ cursor: 'pointer', color: 'white', textDecoration: 'none' }}
          >
            Ranking
          </a>
          <a
            onClick={() => router.push('/admin')}
            style={{ cursor: 'pointer', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
          >
            Admin
          </a>
          <button
            onClick={() => router.push('/alltest')}
            style={{
              backgroundColor: '#00FF11',
              borderRadius: '5px',
              color: 'black',
              padding: '8px 20px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Start Test
          </button>
          <div
            style={{
              cursor: 'pointer',
              fontSize: '24px',
            }}
            onClick={handleUserIconClick}
          >
            <FiUser size={24} />
          </div>
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
              router.push('/ranking');
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
            Ranking
          </a>
          <a
            onClick={() => {
              router.push('/admin');
              setIsOpen(false);
            }}
            style={{
              padding: '10px 0',
              borderBottom: '1px solid #1E5CA8',
              cursor: 'pointer',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Admin
          </a>
          <button
            onClick={() => {
              router.push('/alltest');
              setIsOpen(false);
            }}
            style={{
              marginTop: '10px',
              backgroundColor: '#00FF11',
              borderRadius: '5px',
              color: 'black',
              padding: '8px 15px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Start Test
          </button>
          <a
            onClick={() => {
              router.push('/userdetails');
              setIsOpen(false);
            }}
            style={{
              padding: '10px 0',
              marginTop: '10px',
              cursor: 'pointer',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Profile
          </a>
        </div>
      )}
    </header>
  );
}
