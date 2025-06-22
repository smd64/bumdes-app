// src/components/layout/Topbar/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { Input, InputGroup, Spinner } from '@chakra-ui/react';
import { InputLeftElement } from '@chakra-ui/input';

import { FaSearch } from 'react-icons/fa';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm) return;
    setSearchLoading(true);
    const timeout = setTimeout(() => setSearchLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <InputGroup maxW="300px">
      <InputLeftElement pointerEvents="none">
        <FaSearch color="gray" />
      </InputLeftElement>
      <Input
        type="search"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        bg="gray.100"
        _dark={{ bg: 'gray.700' }}
        rounded="md"
        size="md"
      />
      {searchLoading && <Spinner size="sm" ml={2} color="teal.500" />}
    </InputGroup>
  );
};

export default SearchBar;
