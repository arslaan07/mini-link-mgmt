import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api";
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice'
import Loader from "../../Components/Loader/Loader";
import { toast } from "sonner";
const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate()
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "invalid email address";
    }
    if (!formData.mobile.trim()) {
        newErrors.password = "mobile no. is required";
      } else if(formData.mobile.length !== 10) {
        newErrors.mobile = "mobile no. should be 10 digits";
      }
    if (!formData.password.trim()) {
      newErrors.password = "password is required";
    } else if(formData.password.length < 5) {
        newErrors.password = "password must be at least 5 characters";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "confirm password is required";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "enter same passwords in both fields";
    }

    setErrors(newErrors);

    // If no errors, proceed to submit the form
    if (Object.keys(newErrors).length === 0) {
      const response = await api.post('api/auth/signup', formData)
      console.log(response)
      dispatch(login({
                  user: response.data.user,
                }))
      
      console.log("Form submitted successfully:", formData);
      
    toast.success('YAY! Signup successfull', {
      theme: 'colored',
      style: { backgroundColor: '#bb6a3b', color: '#fff', fontSize: '16px' } 
  });
      navigate(`/${response.data.user.id}/dashboard`)
    }
    } catch (error) {
      toast.error(`{OOPS! ${error.message}`, {
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
          <h1 className={styles.heading}>Join us Today!</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label
                className={` ${errors.name ? styles.errorLabel : ""}`}
                htmlFor="name"
              ></label>
              <input
                style={errors.name ? { border: "2px solid red", outline: "none" } : {}}
                type="name"
                id="name"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <div style={{ height: "5px" }} className={styles.error}>
                  {errors.name}
                </div>
              )}
            </div>
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
            <div className={styles.formGroup}>
              <label
                className={` ${errors.mobile ? styles.errorLabel : ""}`}
                htmlFor="mobile"
              ></label>
              <input
                style={errors.mobile ? { border: "2px solid red", outline: "none" } : {}}
                type="number"
                id="mobile"
                placeholder="Mobile no."
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
              {errors.mobile && (
                <div style={{ height: "5px" }} className={styles.error}>
                  {errors.mobile}
                </div>
              )}
            </div>
            <div
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
            <div
              style={{ marginBottom: "1.5rem" }}
              className={styles.formGroup}
            >
              <label
                className={` ${
                  errors.confirmPassword ? styles.errorLabel : ""
                }`}
                htmlFor="confirmPassword"
              ></label>
              <input
                style={
                  errors.confirmPassword ? { border: "2px solid red", outline: "none" } : {}
                }
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <div style={{ height: "5px" }} className={styles.error}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            <button type="submit" className={styles.btn}>
              Register
            </button>
          </form>
          <p className={styles.registerLink}>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
