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
import Loader from '../Loader/Loader';
import { toast } from 'sonner';
import useLogout from '../../hooks/useLogout';
// import useSearch from '../../hooks/useSearch';

const Navbar = ({ editFormOn, setEditFormOn, response, setResponse, search, setSearch }) => {
  const [formOn, setFormOn] = useState(false);
  const [profileOn, setProfileOn] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const { isLoading, handleLogout } = useLogout()
  // const { handleSearch, clearSearch } = useSearch()

  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);
    
    if(query !== ' ') {
      navigate(`/${user.id}/links`)
  }
  }
  //   console.log(query);
  //   // if (query.length >= 2) {
    //   setIsSearching(true);
    //   try {
    //     const response = await api.get(`/api/urls/search?q=${query}`, {
    //       withCredentials: true
    //     });
    //     setSearchResults(response.data.urls || []);
    //   } catch (error) {
    //     console.error('Search error:', error);
    //     setSearchResults([]);
    //   } finally {
    //     setIsSearching(false);
    //   }
    // } else {
    //   setSearchResults(null);
    // }
  // };



  // Function to clear search
  const clearSearch = () => {
    setSearch('');
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
            Good morning, {user.name.split(' ')[0]} <br />
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
}
export default Navbar;