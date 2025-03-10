import React, { useEffect, useState } from 'react'
import styles from './Analytics.module.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Navbar from '../../Components/Navbar/Navbar'
import api from '../../../api';
import { linkCreationDate } from '../../utils/formatDateAndTime';
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
import Loader from '../../Components/Loader/Loader';
import { useParams } from 'react-router-dom';
import Pagination from '../../Components/Pagination/Pagination';
const dummyLinks = [
    {
      id: 1,
      date: 'Jan 14, 2025 16:30',
      originalLink: 'https://www.example1.com/very-long-url-path',
      shortLink: 'https://c.vt/ab1jukdsfhgkuhsdfukfhsuikdhf',
      remarks: 'campaign1',
      clicks: 5,
      status: 'Active'
    },
    {
      id: 2,
      date: 'Jan 14, 2025 05:45',
      originalLink: 'https://www.example2.com/another-long-path',
      shortLink: 'https://c.vt/ab2',
      remarks: 'campaign2',
      clicks: 5,
      status: 'Inactive'
    },
    {
      id: 3,
      date: 'Jan 14, 2025 07:43',
      originalLink: 'https://www.example3.com/marketing-campaign',
      shortLink: 'https://c.vt/ab3',
      remarks: 'campaign3',
      clicks: 5,
      status: 'Inactive'
    }
  ];
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
  const linksPerPage = 8
const Analytics = () => {
    const [links, setLinks] = useState()
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    console.log(currentPage)
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('api/urls/analytics', { 
                    params: {page: currentPage, limit: linksPerPage},
                    withCredentials: true 
                });
                console.log(response.data.result);
                setLinks(response.data.result);
                setTotalPages(Math.ceil(response.data.totalLinks / linksPerPage));
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            }
        };
    
        fetchAnalytics();
        const intervalId = setInterval(fetchAnalytics, 5000);
        
        return () => clearInterval(intervalId);
    }, [currentPage]);
    
    // let paginatedData
    // if(links && links.length) {
    //  totalPages = Math.ceil(links.length / linksPerPage)
    // paginatedData = links.slice(currentPage * linksPerPage, (currentPage + 1) * linksPerPage)
    // }
    // console.log(totalPages)
    
    // console.log(paginatedData)
    const StatusBadge = ({ status }) => {
        const badgeClass = `${styles.statusBadge} ${
          status === 'Active' ? styles.activeStatus : styles.inactiveStatus
        }`;
        return <span className={badgeClass}>{status}</span>;
      };
      const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert('Link copied to clipboard!');
      };

  const handleEdit = (id) => {
    console.log('Edit link:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete link:', id);
  };
  const checkStatus = (expiryDate) => {
    let date = new Date()
    console.log(date.toLocaleString())
    console.log(expiryDate.toLocaleString())
    return expiryDate > date ? "Active" : "Inactive"
  }
  return (
    <>
    {
  !links ? (
    <div className={styles.loader}>
      <Loader />
    </div>
  ) : (
    links.length > 0 ? (
      <div className={styles.dashboard}>
        <div className={styles.scroll}>
        <table className={styles.tableContainer}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Timestamps</th>
              <th>Original Link</th>
              <th>Short Link</th>
              <th>IP Address</th>
              <th>User Device</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link, i) => (
              <tr key={i} className={styles.tableRow}>
                <td className={styles.createdAt}>{linkCreationDate(link.timestamp)}</td>
                <td><TruncatedLink link={link.originalUrl} /></td>
                <td>
                  <div className={styles.shortLink}>
                    {`${api.defaults.baseURL}/${link.shortUrl}`}
                  </div>
                </td>
                <td>{link.ipAddress}</td>
                <td>{link.device.charAt(0).toUpperCase() + link.device.slice(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
      {
        totalPages > 1 &&
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      }
        </div>
      </div>
    ) : (
      <div className={styles.noDataMessage}>
        No analytics data available.
      </div>
    )
  )
}

</>
  )
}

export default Analytics
