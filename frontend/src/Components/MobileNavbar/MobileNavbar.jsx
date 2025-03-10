// MobileNavbar/index.jsx
import React, { useState } from "react";
import { Menu } from "lucide-react";
import styles from "./MobileNavbar.module.css";
import { formatDateAndTime } from "../../utils/formatDateAndTime";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiHomeSmile2Line } from "react-icons/ri";
import { HiLink } from "react-icons/hi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { IoMdLogOut } from "react-icons/io";
import Loader from '../Loader/Loader';
import LinkModal from "../LinkModal/LinkModal";
import useLogout from "../../hooks/useLogout";



const TopBar = ({ setIsOpen, isOpen }) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className={styles.topSection}>
      <div className={styles.logoSection}>
        <div className={styles.greetings}>
          ☀️
          <div className={styles.wishes}>
            Good morning, {user?.name.split(' ')[0]} <br />
            <p className={styles.formatDateAndTime}>{formatDateAndTime()}</p>
          </div>
        </div>
      </div>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.menuButton}>
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
};

// MobileNavbar/components/ActionBar.jsx
const ActionBar = ({formOn, setFormOn, search, setSearch}) => {
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);
    if(query !== ' ') {
      navigate(`/${user.id}/links`)
    }
  }
  const clearSearch = () => {
    setSearch('');
  };
  return (
    <div className={styles.actionsContainer}>
      <div onClick={() => setFormOn(!formOn)} className={styles.btn}>
                <FaPlus /> Create new
              </div>
              <div className={styles.searchContainer}>
                <div className={styles.search}>
                  <IoSearchOutline className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search by remarks"
                    value={search !== null ? search : ''}
                    onChange={handleSearch}
                    className={styles.searchInput}
                  />
                  {search && (
                    <button 
                      onClick={clearSearch} 
                      className={styles.clearSearch}
                    >
                      ✕
                    </button>
                  )}
                  {/* {isSearching && (
                    <div className={styles.searchingIndicator}>Searching...</div>
                  )} */}
                </div>
              </div>
              {formOn && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <LinkModal
                formOn={formOn}
                setFormOn={setFormOn}
                // editFormOn={editFormOn}
                // setEditFormOn={setEditFormOn}
                // response={response}
                // setResponse={setResponse}
              />
            </div>
          </div>
        )}
    </div>
  );
};

// MobileNavbar/components/NavigationMenu.jsx
const NavigationMenu = ({isOpen, setIsOpen}) => {
    const { user } = useSelector(state => state.auth)
    const id = user.id
    const { handleLogout } = useLogout()
    const handleOpen = () => {
        setIsOpen(!isOpen)
    }
    const handleLogoutAndOpen = () => {
        handleOpen()
        handleLogout()
    }
    return (
      <div className={`${styles.menuContainer} ${isOpen ? styles.open : ""}`}>
        <div className={`${styles.menuContent}`}>
          <Link onClick={handleOpen} to={`/${id}/dashboard`} className={`${styles.dashboard}`}><RiHomeSmile2Line />Dashboard</Link>
          <Link onClick={handleOpen} to={`/${id}/links`} className={`${styles.links}`}><HiLink />Links</Link>
          <Link onClick={handleOpen} to={`/${id}/analytics`} className={`${styles.analytics}`}><FaArrowTrendUp />Analytics</Link>
          <Link onClick={handleOpen} to={`/${id}/settings`} className={`${styles.settings}`}><FiSettings />Settings</Link>
          <Link onClick={handleLogoutAndOpen} className={`${styles.logout}`}><IoMdLogOut />Logout</Link>
        </div>
      </div>
    );
  };

const MobileNavbar = ({isOpen, setIsOpen, formOn, setFormOn, search, setSearch}) => {
    const { isLoading } = useLogout()
    if(isLoading) {
        return <div className={styles.loader}>
        <Loader />
      </div>
    }
  return (
    <nav className={styles.navbar}>
      <TopBar setIsOpen={setIsOpen} isOpen={isOpen} />
      <ActionBar formOn={formOn} setFormOn={setFormOn} search={search} setSearch={setSearch} />
      {isOpen && <NavigationMenu isOpen={isOpen} setIsOpen={setIsOpen} />}
    </nav>
  );
};

export default MobileNavbar;
