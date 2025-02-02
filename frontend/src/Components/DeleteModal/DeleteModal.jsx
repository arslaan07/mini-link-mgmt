import React, { useState } from 'react'
import styles from './DeleteModal.module.css'
import { RxCross2 } from "react-icons/rx";
import api from '../../../api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
const DeleteModal = ({ deleteFormOn, setDeleteFormOn, isDeleteOn, setIsDeleteOn, deleteLink }) => {
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
      if(deleteFormOn) {
      const response = await api.delete(`/api/urls/${deleteLink}`, { withCredentials: true })
      console.log(response)
      setDeleteFormOn(!deleteFormOn)
    }
    if(isDeleteOn) {
      try {
        setIsLoading(true)
        const response = await api.delete(`/api/auth/${params.id}`, { withCredentials: true });
        toast.success('Account deleted successfully', {
                                    theme: 'colored',
                                    style: { backgroundColor: '#fff', color: '#0073e6' } // Custom blue color
                                });
    } catch (error) {
        toast.error('Account deletion failed', {
                                theme: 'colored',
                                style: { backgroundColor: '#fff', color: '#0073e6' } // Custom blue color
                            });
    } finally {
        setIsDeleteOn(!isDeleteOn)
        setIsLoading(false);
    }
        navigate('/login')
    }
    } catch (error) {
      console.error(error)
    }
  }
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
