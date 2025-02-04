import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../../api';
import { logout } from '../store/slices/authSlice';
import { toast } from 'sonner';


const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/auth/logout', { withCredentials: true });
      dispatch(logout());
      localStorage.clear();
      navigate('/login');
      console.log(response.data.message);
      toast.success('YAY! Logout successful', {
        theme: 'colored',
        style: { backgroundColor: '#bb6a3b', color: '#fff', fontSize: '16px' }
      });
    } catch (error) {
      toast.error('OOPS! Logout failed', {
        theme: 'colored',
        style: { backgroundColor: '#ed4337', color: '#fff', fontSize: '16px' }
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleLogout };
};

export default useLogout;
