// MobileNavbar/index.jsx
import React, { useState } from "react";
import { Menu, Plus, Search, Sun } from "lucide-react";
import styles from "./MobileNavbar.module.css";
import { formatDateAndTime } from "../../utils/formatDateAndTime";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { RiHomeSmile2Line } from "react-icons/ri";
import { HiLink } from "react-icons/hi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { IoMdLogOut } from "react-icons/io";
import LinkModal from "../LinkModal/LinkModal";

// import TopBar from './components/TopBar';
// import ActionBar from './components/ActionBar';
// import NavigationMenu from './components/NavigationMenu';
// MobileNavbar/components/TopBar.jsx

const TopBar = ({ setIsOpen, isOpen }) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className={styles.topSection}>
      <div className={styles.logoSection}>
        <div className={styles.greetings}>
          ☀️
          <div className={styles.wishes}>
            Good morning, {user.name} <br />
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
const ActionBar = ({formOn, setFormOn}) => {
  const [response, setResponse] = useState()
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
                    // value={searchQuery}
                    // onChange={handleSearch}
                    className={styles.searchInput}
                  />
                  {/* {searchQuery && (
                    <button 
                      onClick={clearSearch} 
                      className={styles.clearSearch}
                    >
                      ✕
                    </button>
                  )}
                  {isSearching && (
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
    
    const handleOpen = () => {
        setIsOpen(!isOpen)
    }
    return (
      <div className={`${styles.menuContainer} ${isOpen ? styles.open : ""}`}>
        <div className={`${styles.menuContent}`}>
          <Link onClick={handleOpen} to={`/${id}/dashboard`} className={`${styles.dashboard}`}><RiHomeSmile2Line />Dashboard</Link>
          <Link onClick={handleOpen} to={`/${id}/links`} className={`${styles.links}`}><HiLink />Links</Link>
          <Link onClick={handleOpen} to={`/${id}/analytics`} className={`${styles.analytics}`}><FaArrowTrendUp />Analytics</Link>
          <Link onClick={handleOpen} to={`/${id}/settings`} className={`${styles.settings}`}><FiSettings />Settings</Link>
          <Link onClick={handleOpen} className={`${styles.logout}`}><IoMdLogOut />Logout</Link>
        </div>
      </div>
    );
  };

const MobileNavbar = ({isOpen, setIsOpen, formOn, setFormOn}) => {
  
  return (
    <nav className={styles.navbar}>
      <TopBar setIsOpen={setIsOpen} isOpen={isOpen} />
      <ActionBar formOn={formOn} setFormOn={setFormOn} />
      {isOpen && <NavigationMenu isOpen={isOpen} setIsOpen={setIsOpen} />}
    </nav>
  );
};

export default MobileNavbar;
