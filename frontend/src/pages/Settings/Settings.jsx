import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector to access Redux store
import styles from './Settings.module.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Navbar from '../../Components/Navbar/Navbar';
import DeleteModal from '../../Components/DeleteModal/DeleteModal';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import { login } from '../../store/slices/authSlice';
import Loader from '../../Components/Loader/Loader';
import { toast } from 'sonner';

const Settings = () => {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.user);
    console.log(currentUser)
    const navigate = useNavigate()
    const [isDeleteOn, setIsDeleteOn] = useState(false);
    // const [formData, setFormData] = useState({
    //     name: "",
    //     email: "",
    //     mobile: "",
    // });
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        mobile: currentUser?.mobile?.toString() || '',  
      });
    const [errors, setErrors] = useState({});
    const params = useParams()
    
    // Populate formData when user data is available
    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem('user'))
    //     user.mobile = user.mobile.toString()
    //     setFormData({
    //         name: user.name,
    //         email: user.email,
    //         mobile: user.mobile,
    //     })
    // }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(value);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Validation logic
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }
        
        if (!formData.mobile.trim()) {
            newErrors.mobile = "Mobile number is required";
        } else if (formData.mobile.length !== 10) {
            newErrors.mobile = "Mobile number should be 10 digits";
        }
        
        setErrors(newErrors);
        
        // Only proceed if there are no validation errors
        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await api.put(`/api/auth/${params.id}`, formData, { 
                    withCredentials: true 
                });
                
                // Update Redux store
                dispatch(login({
                    user: response.data.user
                }));
                toast.success('Profile updated successfully', {
                                        theme: 'colored',
                                        style: { backgroundColor: '#bb6a3b', color: '#fff', fontSize: '16px' } 
                                    });
                console.log("Form submitted successfully:", formData);
                
            } catch (error) {
                toast.success('Profile updated failed', {
                    theme: 'colored',
                    style: { backgroundColor: '#ed4337', color: '#fff', fontSize: '16px' }
                });
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        }
    }

    const handleDelete = async () => {
        setIsDeleteOn(!isDeleteOn);
       
    };
    // const handleSave = async () => {
    //     try {
    //         const response = await api.put(`/api/auth/${params.id}`, formData, { withCredentials: true } )
    //           // Update Redux store
    //     dispatch(login({
    //         user: response.data.user
    //       }));
  
    //       // Update localStorage
    //     //   localStorage.setItem('user', JSON.stringify(response.data.user));
    //         // localStorage.setItem('user', JSON.stringify(response.data.user))
    //         // console.log(response.data.user)
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    return (
        <>
                {
                    isLoading ? <div className={styles.loader}><Loader /></div> : (
                
                <div className={styles.settings}>
                    <div className={styles.form}>
                        <form >
                            <div className={styles.formGroup}>
                                <label className={`${errors.name ? styles.errorLabel : ''}`} htmlFor="name">Name</label>
                                <div>
                                <input
                                    style={errors.name ? { border: '2px solid red' } : {}}
                                    type="text"
                                    id="name"
                                    placeholder="Enter a name"
                                    onChange={handleChange}
                                    value={formData.name}
                                    name="name"
                                    required
                                />
                                {errors.name && (
                                    <div style={{ height: "5px" }} className={styles.error}>
                                        {errors.name}
                                    </div>
                                )}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={`${errors.email ? styles.errorLabel : ''}`} htmlFor="email">Email id</label>
                                <div>
                                <input
                                    style={errors.email ? { border: '2px solid red' } : {}}
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    name="email"
                                    required
                                />
                                {errors.email && (
                                    <div style={{ height: "5px" }} className={styles.error}>
                                        {errors.email}
                                    </div>
                                )}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={`${errors.mobile ? styles.errorLabel : ''}`} htmlFor="mobile">Mobile no.</label>
                                <div>
                                <input
                                    style={errors.mobile ? { border: '2px solid red' } : {}}
                                    type="number"
                                    id="mobile"
                                    placeholder="Enter mobile no."
                                    onChange={handleChange}
                                    value={formData.mobile}
                                    name="mobile"
                                    required
                                />
                                {errors.mobile && (
                                    <div style={{ height: "5px" }} className={styles.error}>
                                        {errors.mobile}
                                    </div>
                                )}
                                </div>
                            </div>
                            <button
                            onClick={handleSave}
                                type="submit"
                                className={`${styles.btn} ${styles.primaryBtn}`}
                            >
                                Save Changes
                            </button>
                            <button onClick={handleDelete} type="button" className={`${styles.btn} ${styles.secondaryBtn}`}>
                                Delete Account
                            </button>
                        </form>
                    </div>
                </div>
                )}
            {isDeleteOn && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <DeleteModal isDeleteOn={isDeleteOn} setIsDeleteOn={setIsDeleteOn} />
                    </div>
                </div>
            )}
        </>
    );
    
};

export default Settings;