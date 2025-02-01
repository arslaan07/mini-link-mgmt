import React from 'react'
import styles from './Sidebar.module.css'
import { RiHomeSmile2Line } from "react-icons/ri";
import { HiLink } from "react-icons/hi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { Link, useLocation, useParams } from 'react-router-dom';
const Sidebar = () => {
  const params = useParams()
  const { id } = params;
  const location = useLocation()
  return (
    <div className={styles.container}>
      
      <Link to={`/${id}/dashboard`} className={`${styles.dashboard} ${location.pathname === `/${id}/dashboard` ? styles.active: ''}`}><RiHomeSmile2Line />Dashboard</Link>
      <Link to={`/${id}/links`} className={`${styles.links} ${location.pathname === `/${id}/links` ? styles.active: ''}`}><HiLink />Links</Link>
      <Link to={`/${id}/analytics`} className={`${styles.analytics} ${location.pathname === `/${id}/analytics` ? styles.active: ''}`}><FaArrowTrendUp />Analytics</Link>
      <Link to={`/${id}/settings`} className={`${styles.settings} ${location.pathname === `/${id}/settings` ? styles.active: ''}`}><FiSettings />Settings</Link>
    </div>
  )
}

export default Sidebar
