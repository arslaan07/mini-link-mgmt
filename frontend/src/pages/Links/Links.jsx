import React, { useEffect, useState } from 'react'
import styles from './Links.module.css'
import api from '../../../api';
import { linkCreationDate } from '../../utils/formatDateAndTime';
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
import DeleteModal from '../../Components/DeleteModal/DeleteModal';
import Loader from '../../Components/Loader/Loader';
import Pagination from '../../Components/Pagination/Pagination';
import LinkModal from '../../Components/LinkModal/LinkModal';
import { toast } from 'sonner';
import { useNavigate, useOutletContext } from 'react-router-dom';
import SearchLoadingAnimation from '../../Components/SearchLoadingAnimation/SearchLoadingAnimation';
import { useDispatch, useSelector } from 'react-redux';
import { setUrlCount } from '../../store/slices/urlSlice';

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
  const TruncatedRemark = ({ remark }) => {
    const truncatedText = remark.length > 25 
      ? `${remark.substring(0, 25)}...` 
      : remark;
  
    return (
      <div className={styles.remarkContainer}>
        <span className={styles.truncatedRemark}>{truncatedText}</span>
        <span className={styles.fullRemark}>{remark}</span>
      </div>
    );
  };
const linksPerPage = 7
const Links = () => {
    const [links, setLinks] = useState()
    const [editFormOn, setEditFormOn] = useState(false)
    const [deleteFormOn, setDeleteFormOn] = useState(false)
    const [response, setResponse] = useState()
    const [deleteLink, setDeleteLink] = useState()
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const navigate = useNavigate()
    const { search } = useOutletContext()
    const dispatch = useDispatch()
    const { urlCount } = useSelector((state) => state.url)

    // console.log(typeof searchQuery.searchQuery)
    // console.log(currentPage)

    // useEffect(() => {
    //     let intervalId;
    
    //     const fetchLinks = async () => {
    //         try {
    //             // console.log("search: ", searchQuery.searchQuery)
    //             const response = await api.get('/api/urls', {
    //                 params: {page: currentPage, limit: linksPerPage},
    //                 withCredentials: true });
    //                 console.log(response)
    //             setLinks(response.data.paginatedUrls);
    //             setTotalPages(Math.ceil(response.data.totalLinks / linksPerPage));
    //             // console.log(response.data.paginatedUrls)
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    
    //     // Fetch links immediately on component mount
    //     fetchLinks();
    
    //     // Set up interval to fetch links every 5 seconds
    //     intervalId = setInterval(fetchLinks, 5000);
    
    //     // Cleanup interval on component unmount
    //     return () => clearInterval(intervalId);
    // }, [currentPage]);
    const handleEdit = async (linkId) => {
      setIsLoading(true)
      try {
          const response = await api.get(`/api/urls/url/${linkId}`, { withCredentials: true });
          setResponse(response.data.url)
          console.log(response.data.url)
      } catch (error) {
          console.error(error);
      }
      finally {
          setIsLoading(false)
      }
      // console.log(editFormOn)
      setEditFormOn(!editFormOn)
    };
  
    const handleDelete = (linkId) => {
      setDeleteLink(linkId)
      setDeleteFormOn(!deleteFormOn)
    };
    useEffect(() => {
      const fetchLinks = async () => {
        try {
          let response;
          let params = { page: currentPage, limit: linksPerPage };
    
          if (search) {
            // Search scenario
            setIsSearching(true)
            params.search = search;
            response = await api.get('/api/urls/search', { params, withCredentials: true });
            setLinks(response.data.paginatedSearch);
            setIsSearching(false)
          } else {
            // Normal fetching scenario
            response = await api.get('/api/urls', { params, withCredentials: true });
            setLinks(response.data.paginatedUrls);
            dispatch(setUrlCount(response.data.paginatedUrls.length))
          }
    
          setTotalPages(Math.ceil(response.data.totalLinks / linksPerPage));
        } catch (error) {
          console.error(error);
        }
      };
    
      // Fetch immediately
      fetchLinks();
    
      // Set up polling only for non-search scenario
      // let intervalId;
      // if (!search) {
      //   intervalId = setInterval(fetchLinks, 5000);
      // }
    
      // Cleanup interval
      // return () => {
      //   if (intervalId) {
      //     clearInterval(intervalId);
      //   }
      // };
    }, [currentPage, search, urlCount]);
    if(isLoading) {
      return <div className={styles.loader}><Loader /></div>
    }
    
    
    // useEffect(() => {
    //     const fetchLinks = async () => {
    //         try {
    //             const params = { page: currentPage, limit: linksPerPage };
    //             const response = await api.get('/api/urls', { 
    //                 params, 
    //                 withCredentials: true 
    //             });
    
    //             setLinks(response.data.paginatedUrls);
    //             setTotalPages(Math.ceil(response.data.totalLinks / linksPerPage));
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     fetchLinks();
    // }, [handleDelete, handleEdit]); 
    
  
    
    let paginatedData
    if(links && links.length > 0) {
    //  totalPages = Math.ceil(links.length / linksPerPage)
    // paginatedData = links.slice(currentPage * linksPerPage, (currentPage + 1) * linksPerPage)
    // console.log(totalPages)
    }
    
    
    // console.log(paginatedData)
    const StatusBadge = ({ status }) => {
        const badgeClass = `${styles.statusBadge} ${
          status === 'Active' ? styles.activeStatus : styles.inactiveStatus
        }`;
        return <span className={badgeClass}>{status}</span>;
      };
      const handleCopy = (text) => {
        navigator.clipboard.writeText(`${api.defaults.baseURL}/${text}`);
        toast.success('YAY! Link copied', {
            theme: 'colored',
            style: { backgroundColor: '#bb6a3b', color: '#fff', fontSize: '16px' },
            position: 'top-center'
        });
      };

 
  const checkStatus = (d) => {     
    let currentDate = new Date()
    let expiryDate
    if(d === null) {
      expiryDate = new Date(currentDate)
      expiryDate.setDate(currentDate.getDate() + 1)
    }
    else {
      expiryDate = new Date(d)
    }
    return expiryDate > currentDate ? "Active" : "Inactive"   
} 
{/* <Navbar 
          editFormOn={editFormOn} 
          setEditFormOn={setEditFormOn} 
          response={response} 
          setResponse={setResponse} 
          search={search}
          setSearch={setSearch}
        /> */}

  return (
<>
  {isLoading && (
    <div className={styles.loader}>
      <Loader />
    </div>
  )}
  {isLoading === false && (
    <>
      {!links ? (
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
                  {links.map((link) => (
                    <tr key={link._id} className={styles.tableRow}>
                      <td className={styles.createdAt}>{linkCreationDate(link.createdAt)}</td>
                      <td><TruncatedLink link={link.originalUrl} /></td>
                      <td>
                        <div className={styles.shortLink}>
                          <TruncatedLink link={`${api.defaults.baseURL}/${link.shortUrl}`} />
                          <IoCopyOutline 
                            className={styles.copyIcon} 
                            onClick={() => handleCopy(link.shortUrl)} 
                          />
                        </div>
                      </td>
                      <td><TruncatedRemark remark={link.remarks} /></td>
                      <td>{link.clickData.length}</td>
                      <td>
                        <StatusBadge status={checkStatus(link.expirationDate)} />
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
            </div>
            <div className={styles.pagination}>
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
              )}
            </div>
          </div>
        ) : (
          <div className={styles.noLinksMessage}>
            No links created yet.
          </div>
        )
      )}
    </>
  )}
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
  <SearchLoadingAnimation isSearching = {isSearching} />
</>
  )
}

export default Links
