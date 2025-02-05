import React from 'react'
import styles from './SearchLoadingAnimation.css'
const SearchLoadingAnimation = ({ isSearching }) => {
    if (!isSearching) return null;
  return (
    <div className={styles.loadingContainer}>
    <div className={styles.loadingDot}></div>
    <div className={styles.loadingDot}></div>
    <div className={styles.loadingDot}></div>
  </div>
  )
}

export default SearchLoadingAnimation
