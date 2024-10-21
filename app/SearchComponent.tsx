'use client'
import { useState, ChangeEvent, useRef, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  login: string;
}

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);  
  const handleSearch = async () => {
    try {
      //const response = await fetch('https://api.github.com/users');
      //const data: User[]= await response.json();
      //const filteredUsers = data.filter(user => user.login.includes(searchTerm));
      const response = await axios.get<User[]>('https://api.github.com/users');
      const filteredUsers = response.data.filter(user => user.login.includes(searchTerm));
      setUsers((filteredUsers).slice(0, 10));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const debounce = (func: () => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(func, delay);
    };
  };

  const debouncedSearch = debounce(handleSearch, 300);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value=event.target.value;
    setSearchTerm(value);
    if(!value) {
      setUsers([]);
    }else{
    debouncedSearch();
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <label className="text-lg mb-2">Search the Username:</label>
      <input
       ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleChange}
        className="input input-bordered w-full max-w-xs mb-4"
      />
      <ul className="list-none p-0">
        {users.map(user => (
          <li key={user.id} className="bg-base-200 border border-base-300 rounded-lg p-2 mb-2 w-full max-w-xs text-center">
            {user.login}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;