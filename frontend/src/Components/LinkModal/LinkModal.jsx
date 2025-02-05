import React, { useEffect, useState } from 'react';
import styles from './LinkModal.module.css';
import { RxCross2 } from "react-icons/rx";
import { IoCalendarOutline } from "react-icons/io5";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { linkExpirationDate } from '../../utils/formatDateAndTime';
import api from '../../../api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../Loader/Loader';
import { toast } from 'sonner';

const LinkModal = ({ formOn, setFormOn, editFormOn, setEditFormOn, response, setResponse }) => {
    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate();
    const [isExpirationOn, setIsExpirationOn] = useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    // console.log(editFormOn)
    // console.log('formOn: ', formOn)
    useEffect(() => {
        if (response && response !== 'undefined' && response.expirationDate === null) {
            setIsExpirationOn(false);
        }
    }, [response]);

    const [formData, setFormData] = useState(() => {
        if (editFormOn && response && response !== 'undefined') {
            return {
                originalUrl: response.originalUrl || "",
                remarks: response.remarks || "",
                expirationDate: response.expirationDate || "",
            };
        } else {
            return {
                originalUrl: "",
                remarks: "",
                expirationDate: "",
            };
        }
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const newErrors = {};
        if (!formData.originalUrl.trim()) {
            newErrors.originalUrl = "This field is mandatory";
        }
        if (!formData.remarks.trim()) {
            newErrors.remarks = "This field is mandatory";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                let Response;
                if (formOn) {
                    Response = await api.post('/api/urls', formData, { withCredentials: true });
                } else if (editFormOn && response && response !== 'undefined') {
                    if (!isExpirationOn) {
                        formData.expirationDate = null;
                    }
                    Response = await api.put(`/api/urls/${response._id}`, formData, { withCredentials: true });
                }
                if (typeof setResponse === 'function') {
                    setResponse(Response);
                }
                console.log("Form submitted successfully:", formData);
                if(typeof setFormOn === 'function'){
                    setFormOn(false);
                    toast.success('YAY! Link created successfully', {
                        theme: 'colored',
                        style: { backgroundColor: '#bb6a3b', color: '#fff', fontSize: '16px' } 
                    });
                    navigate(`/${user.id}/links`);
                    return
                }
                if (typeof setEditFormOn === 'function') {
                    setEditFormOn(false);
                    toast.success('YAY! Link edited successfully', {
                        theme: 'colored',
                        style: { backgroundColor: '#bb6a3b', color: '#fff', fontSize: '16px' } 
                    });
                }
                navigate(`/${user.id}/links`);
            } catch (error) {
                toast.error('OOPS !', {
                    theme: 'colored',
                    style: { backgroundColor: '#ed4337', color: '#fff', fontSize: '16px' } 
                });
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCreateForm = () => {
        // console.log(typeof setFormOn)
        if(typeof setFormOn === 'function') 
        setFormOn(false);
    // console.log("formOn: ", formOn)
        if(typeof setEditFormOn === 'function')
        setEditFormOn(false);
    };

    const handleDateChange = (date) => {
        setStartDate(date);
        handleChange({ target: { name: "expirationDate", value: date.toISOString() } });
        setIsOpen(false);
    };

    const toggleDatePicker = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const handleClear = () => {
        setFormData({
            originalUrl: "",
            remarks: "",
            expirationDate: "",
        });
        setStartDate(new Date());
        setErrors({});
    };

    const handleExpirationToggle = () => {
        setIsExpirationOn(!isExpirationOn);
    };

    return (
        isLoading ? <div><Loader /></div> : (
            <div className={styles.container}>
                <div className={styles.nav}>
                    {formOn ? "New Link" : "Edit Link"}
                    <span onClick={handleCreateForm} className={styles.pageSpan}><RxCross2 /></span>
                </div>
                <div className={styles.form}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={`${errors.originalUrl ? styles.errorLabel : ''} ${styles.requiredField}`} htmlFor="originalUrl">Destination Url</label>
                            <input
                                style={errors.originalUrl ? { border: '2px solid red' } : {}}
                                type="text"
                                id="originalUrl"
                                placeholder="https://web.whatsapp.com/"
                                onChange={handleChange}
                                value={formData.originalUrl}
                                name="originalUrl"
                                required
                            />
                            {errors.originalUrl && (
                                <div style={{ height: "5px" }} className={styles.error}>
                                    {errors.originalUrl}
                                </div>
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <label className={`${errors.remarks ? styles.errorLabel : ''} ${styles.requiredField}`} htmlFor="remarks">Remarks</label>
                            <textarea
                                style={errors.remarks ? { border: '2px solid red' } : {}}
                                id="remarks"
                                placeholder="Add remarks"
                                onChange={handleChange}
                                value={formData.remarks}
                                name="remarks"
                                required
                            />
                            {errors.remarks && (
                                <div style={{ height: "5px" }} className={styles.error}>
                                    {errors.remarks}
                                </div>
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <div className={styles.linkLabel}>
                                <label
                                    className={`${styles.label} ${errors.expirationDate ? styles.errorLabel : ""}`}
                                    htmlFor="expirationDate"
                                >
                                    Link Expiration
                                </label>
                                <div>
                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            checked={isExpirationOn}
                                            onChange={handleExpirationToggle}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                            </div>
                            {isExpirationOn && (
                                <>
                                    <div className={styles.inputContainer}>
                                        <input
                                            className={`${styles.input} ${errors.expirationDate ? styles.inputError : ""}`}
                                            type="text"
                                            id="expirationDate"
                                            placeholder="Select date"
                                            value={editFormOn && response && response !== 'undefined' ? linkExpirationDate(formData.expirationDate) : linkExpirationDate(startDate)}
                                            onChange={handleChange}
                                            name="expirationDate"
                                            required
                                        />
                                        <button className={styles.datePickerBtn} onClick={toggleDatePicker}>
                                            <IoCalendarOutline />
                                        </button>
                                    </div>
                                    {isOpen && (
                                        <div className={styles.datePickerOverlay}>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={handleDateChange}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="time"
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                minDate={new Date()}
                                                inline
                                            />
                                        </div>
                                    )}
                                    {errors.expirationDate && (
                                        <div style={{ height: "5px" }} className={styles.error}>
                                            {errors.expirationDate}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className={styles.footer}>
                            <button
                                type="button"
                                onClick={handleClear}
                                className={`${styles.btn} ${styles.primaryBtn}`}
                            >
                                Clear
                            </button>
                            <button type="submit" className={`${styles.btn} ${styles.secondaryBtn}`}>
                                {formOn ? "Create new" : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default LinkModal;