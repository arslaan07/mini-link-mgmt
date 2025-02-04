import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, clearSearchQuery } from "../store/slices/urlSlice";


const useSearch = () => {
    const { searchQuery } = useSelector(state => state.url)
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearch(query);
        dispatch(setSearchQuery({
          searchQuery: query
        }));
        console.log(query);
    }
      const clearSearch = () => {
        setSearch('');
        dispatch(clearSearchQuery());
      }
      return { handleSearch, clearSearch, search };
}

export default useSearch