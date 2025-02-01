import React from 'react';
import styles from './Pagination.module.css'

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  let pages = [];
  for (let page = 1; page <= totalPages; page++) {
    pages.push(page);
  }

  return (
    <div className={styles.paginationContainer}>
      {pages.map((page, i) => (
        <button
          className={`${styles.button} ${currentPage === page - 1 ? styles.active : ''}`}
          key={i}
          onClick={() => setCurrentPage(page - 1)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;