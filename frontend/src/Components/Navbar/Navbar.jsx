// Navbar.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Navbar.module.css';
import { FaPlus } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { formatDateAndTime } from '../../utils/formatDateAndTime';
import LinkModal from '../LinkModal/LinkModal';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import { logout } from '../../store/slices/authSlice';
import Search from '../Search/Search';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';

const Navbar = ({ editFormOn, setEditFormOn, response, setResponse }) => {
  const [formOn, setFormOn] = useState(false);
  const [profileOn, setProfileOn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      setIsSearching(true);
      try {
        const response = await api.get(`/api/urls/search?q=${query}`, {
          withCredentials: true
        });
        setSearchResults(response.data.urls || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults(null);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true); // Show loading spinner while logout is in progress
      const response = await api.get('/api/auth/logout', { withCredentials: true });
      dispatch(logout());
      localStorage.clear()
      navigate('/login');
      console.log(response.data.message)
      toast.success('Logout successfull', {
        theme: 'colored',
        style: { backgroundColor: '#fff', color: '#0073e6' } // Custom blue color
    });
    } catch (error) {
      toast.error('Logout failed', {
        theme: 'colored',
        style: { backgroundColor: '#fff', color: '#0073e6' } // Custom blue color
    });
      console.error(error);
    }
    finally {
      setIsLoading(false); // Hide loading spinner after logout is completed
    }
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  // if (!user) {
  //   return div className={styles.loader}><Loader /></div>
  // }
  if(isLoading) {
   return <div className={styles.loader}>
    <Loader />
  </div>
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.greetings}>☀️
          <div className={styles.wishes}>
            Good morning, {user.name} <br />
            <p className={styles.formatDateAndTime}>{formatDateAndTime()}</p>
          </div>
        </div>
        
        <div onClick={() => setFormOn(!formOn)} className={styles.btn}>
          <FaPlus /> Create new
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.search}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by remarks"
              value={searchQuery}
              onChange={handleSearch}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button 
                onClick={clearSearch} 
                className={styles.clearSearch}
              >
                ✕
              </button>
            )}
            {isSearching && (
              <div className={styles.searchingIndicator}>Searching...</div>
            )}
          </div>
        </div>

        <button onClick={() => setProfileOn(!profileOn)} className={styles.profile}>
          {user.userInitials}
        </button>

        {profileOn && (
          <div onClick={handleLogout} className={styles.profileOverlay}>
            <div className={styles.profileContent}>Logout</div>
          </div>
        )}

        {formOn && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <LinkModal
                formOn={formOn}
                setFormOn={setFormOn}
                editFormOn={editFormOn}
                setEditFormOn={setEditFormOn}
                response={response}
                setResponse={setResponse}
              />
            </div>
          </div>
        )}
      </div>

      {/* Search Results Component */}
      {searchResults !== null && (
        <div className={styles.searchPage}>
          <Search 
            searchResults={searchResults}
            onClose={clearSearch}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;