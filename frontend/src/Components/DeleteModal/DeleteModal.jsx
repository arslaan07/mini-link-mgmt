import React from 'react'
import styles from './DeleteModal.module.css'
import { RxCross2 } from "react-icons/rx";
import api from '../../../api';
import { useNavigate, useParams } from 'react-router-dom';
const DeleteModal = ({ deleteFormOn, setDeleteFormOn, isDeleteOn, setIsDeleteOn, deleteLink }) => {
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
      
        const response = await api.delete(`/api/auth/${params.id}`, { withCredentials: true });
        console.log(response);
        setIsDeleteOn(!isDeleteOn)

        navigate('/login')
    }
    } catch (error) {
      console.error(error)
    }
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
