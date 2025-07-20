import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        AI Chatbot
      </Link>

      <div className={styles.userInfo}>
        {user ? (
          <>
            <span>Hello, {user.name}</span>
            <button onClick={logout} className={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>
              Login
            </Link>
            <Link to="/register" className={styles.link}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
