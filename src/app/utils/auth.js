

// useToken.js
import { useState, useEffect } from 'react';

function useToken() {
  const [Token, setToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token_WORK');
    if (token) {
      setToken(token);
    } else {
      setToken(null);
    }
  }, []);

  return { Token };
}
export default useToken;