import React from 'react'
import styles from './Logo.module.css'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
const Logo = () => {
    const { user } = useSelector(state => state.auth)
  return (
    <Link to={user === null ? '/login' : `${user?.id}/dashboard`} className={styles.logo}>
        <img className={styles.logoImg} src="/images/kitly.png" alt="Logo" />
    </Link>
  )
}

export default Logo
