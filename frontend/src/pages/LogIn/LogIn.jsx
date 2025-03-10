import React, { useEffect, useState } from 'react'
import styles from './LogIn.module.css'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../../api';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice'
import Loader from '../../Components/Loader/Loader';
import { toast } from 'sonner';
const LogIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
      const [errors, setErrors] = useState({});
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(value);
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const newErrors = {};
        if (!formData.email.trim()) {
          newErrors.email = "email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "invalid email address";
        }
        if (!formData.password.trim()) {
          newErrors.password = "password is required";
        } 
    
        setErrors(newErrors);
    
        // If no errors, proceed to submit the form
        if (Object.keys(newErrors).length === 0) {  
          const response = await api.post('api/auth/login', formData, { withCredentials: true });
          console.log(response)
          
          dispatch(login({
            user: response.data.user,
          }))
          // localStorage.setItem('user', JSON.stringify(response.data.user))
          // localStorage.setItem('isAthenticated', "true")
          console.log("Form submitted successfully:", formData);
          toast.success('YAY! Login successfull', {
                                  theme: 'colored',
                                  style: { backgroundColor: '#bb6a3b', color: '#fff', fontSize: '16px' } 
                              });
          // navigate(`/${response.data.user.id}/dashboard`)
        }
        } catch (error) {
          toast.error('OOPS! Invalid Credentials', {
                                  theme: 'colored',
                                  style: { backgroundColor: '#ed4337', color: '#fff', fontSize: '16px' }
                              });
            console.log(error)
        }
        finally {
          setIsLoading(false)
        }
      };
      if(isLoading) {
        return <div className={styles.loader}><Loader /></div>
      }
  return (
    <div className={styles.container}>
      <div className={styles.heroImg}>
        <img className={styles.clouds} src="./images/pro.png" alt="" />
      </div>
      <div className={styles.heroSection}>
        <nav className={styles.nav}>
          <Link to={'/signup'} className={styles.signupLink}>Signup</Link>
          <Link to={'/login'} className={styles.loginLink}>Login</Link>
        </nav>

        <div className={styles.form}>
          <h1 className={styles.heading}>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label
                className={` ${errors.email ? styles.errorLabel : ""}`}
                htmlFor="email"
              ></label>
              <input
                style={errors.email ? { border: "2px solid red", outline: "none" } : {}}
                type="email"
                id="email"
                placeholder="Email id"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <div style={{ height: "5px" }} className={styles.error}>
                  {errors.email}
                </div>
              )}
            </div>
            <div
              style={{ marginBottom: "1.5rem" }}
              className={styles.formGroup}
            >
              <label
                className={` ${errors.password ? styles.errorLabel : ""}`}
                htmlFor="password"
              ></label>
              <input
                style={errors.password ? { border: "2px solid red", outline: "none" } : {}}
                type="password"
                id="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <div style={{ height: "5px" }} className={styles.error}>
                  {errors.password}
                </div>
              )}
            </div>
            <button type="submit" className={styles.btn}>
              Login
            </button>
          </form>
          <p className={styles.registerLink}>
            Don't have an account? <a href="/signup">SignUp</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LogIn
