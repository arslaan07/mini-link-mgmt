import React from 'react';
import styles from './SearchLoadingAnimation.module.css';

const SearchLoadingAnimation = ({ isSearching }) => {
  if (!isSearching) return null;
  
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.searchCircle}>
        <div className={styles.searchInner}></div>
      </div>
      <div className={styles.searchText}>Searching...</div>
    </div>
  );
};

export default SearchLoadingAnimation;
