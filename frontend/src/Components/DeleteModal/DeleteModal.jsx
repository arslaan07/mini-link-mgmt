import React, { useState } from 'react'
import styles from './DeleteModal.module.css'
import { RxCross2 } from "react-icons/rx";
import api from '../../../api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
const DeleteModal = ({ deleteFormOn, setDeleteFormOn, isDeleteOn, setIsDeleteOn, deleteLink }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  if(!isAuthenticated) {
    navigate('/login')
  }
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  const handleClick = () => {
    if(deleteFormOn)
    setDeleteFormOn(!deleteFormOn)
  if(isDeleteOn)
    setIsDeleteOn(!isDeleteOn)
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true);
  
      // Delete URL if `deleteFormOn` is active
      if (deleteFormOn) {
        await api.delete(`/api/urls/${deleteLink}`, { withCredentials: true });
        setDeleteFormOn(false);
      }
  
      // Delete Account if `isDeleteOn` is active
      if (isDeleteOn) {
        await api.delete(`/api/auth/${params.id}`, { withCredentials: true });
        dispatch(logout())
        localStorage.clear()
        toast.success("Account deleted successfully", {
          theme: "colored",
          style: { backgroundColor: "#fff", color: "#0073e6" }, // Custom blue color
        });
  
        // Redirect user after account deletion
        navigate("/login");
      }
    } catch (error) {
      toast.error("Deletion failed", {
        theme: "colored",
        style: { backgroundColor: "#fff", color: "#0073e6" },
      });
    } finally {
      setIsDeleteOn(false);
      setIsLoading(false);
    }
  };
  
  if(isLoading) {
    return <div className={styles.loader}><Loader /></div>
  }
  return (
    <div className={styles.container}>
      <span onClick={handleClick} className={styles.cross}><RxCross2 /></span>
      <div className={styles.main}>
        <p className={styles.heading}>
          {
            deleteFormOn? "Are you sure, you want to remove it ?" : "Are you sure, you want to delete the account ?"
          } </p>
        <div className={styles.buttonContainer}>
            <button onClick={handleClick} className={`${styles.button} ${styles.no}`}>NO</button>
            <button onClick={handleDelete} className={`${styles.button} ${styles.yes}`}>YES</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
