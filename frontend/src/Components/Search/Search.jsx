import React, { useState } from 'react';
import styles from '../../pages/Links/Links.module.css';
import { linkCreationDate } from '../../utils/formatDateAndTime';
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
import Loader from '../Loader/Loader';
import LinkModal from '../../Components/LinkModal/LinkModal';
import DeleteModal from '../../Components/DeleteModal/DeleteModal';
import api from '../../../api';
const TruncatedLink = ({ link }) => {
    return (
      <div className={styles.linkContainer}>
        <span className={styles.truncatedLink}>{link}</span>
        <button 
          className={styles.copyButton}
          onClick={() => handleCopy(link)}
        >
        </button>
      </div>
    );
  };

  const TruncatedRemark = ({ remark }) => {
    const truncatedText = remark.length > 35 
      ? `${remark.substring(0, 35)}...` 
      : remark;
  
    return (
      <div className={styles.remarkContainer}>
        <span className={styles.truncatedRemark}>{truncatedText}</span>
        <span className={styles.fullRemark}>{remark}</span>
      </div>
    );
  };

const StatusBadge = ({ expiryDate }) => {
  const currentDate = new Date();
  const status = new Date(expiryDate) > currentDate ? "Active" : "Inactive";
  
  const badgeClass = `${styles.statusBadge} ${
    status === 'Active' ? styles.activeStatus : styles.inactiveStatus
  }`;
  
  return <span className={badgeClass}>{status}</span>;
};

const Search = ({ searchResults, onCopy }) => {
  const [editFormOn, setEditFormOn] = useState(false);
  const [deleteFormOn, setDeleteFormOn] = useState(false);
  const [response, setResponse] = useState(null);
  const [deleteLink, setDeleteLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async (linkId) => {
    
  };

  const handleDelete = (linkId) => {
   
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  if (!searchResults) {
    return <Loader />;
  }

  return (
    <div className={styles.searchOverlay}>
      <div className={styles.searchResults}>
        {searchResults.length > 0 ? (
          <table className={styles.tableContainer}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>Date</th>
                <th>Original Link</th>
                <th>Short Link</th>
                <th>Remarks</th>
                <th>Clicks</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((link) => (
                <tr key={link._id} className={styles.tableRow}>
                  <td className={styles.createdAt}>{linkCreationDate(link.createdAt)}</td>
                  <td>
                    <TruncatedLink link={link.originalUrl} />
                  </td>
                  <td>
                    <div className={styles.shortLink}>
                      <TruncatedLink link={`https://mini-link-mgmt.onrender.com/${link.shortUrl}`} />
                      <IoCopyOutline
                        className={styles.copyIcon}
                        onClick={() => handleCopy(`https://mini-link-mgmt.onrender.com/api/urls/${link.shortUrl}`)}
                      />
                    </div>
                  </td>
                  <td>
                    <TruncatedRemark remark={link.remarks} />
                  </td>
                  <td>{link.clickData.length}</td>
                  <td>
                    <StatusBadge expiryDate={link.expirationDate} />
                  </td>
                  <td>
                    <div className={styles.actionsContainer}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleEdit(link._id)}
                      >
                        <MdModeEdit className={styles.edit} />
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleDelete(link._id)}
                      >
                        <RiDeleteBin6Line className={styles.delete} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.noResults}>No results found</div>
        )}
      </div>

      {/* Edit Modal */}
      {editFormOn && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <LinkModal
              editFormOn={editFormOn}
              setEditFormOn={setEditFormOn}
              response={response}
              setResponse={setResponse}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteFormOn && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <DeleteModal
              deleteFormOn={deleteFormOn}
              setDeleteFormOn={setDeleteFormOn}
              deleteLink={deleteLink}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;