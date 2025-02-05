import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const useSearch = () => {
    const [search, setSearch] = useState('');
    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearch(query);
        console.log(search);
    }
      const clearSearch = () => {
        setSearch('');
      }
      return { handleSearch, clearSearch, search };
}

export default useSearch