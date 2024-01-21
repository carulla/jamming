import React, { useState, useCallback } from 'react';

import './SearchBar.css';

const SearchBar = (props) => {
  const [term, setTerm] = useState('');

  const search = useCallback(
    (e) => {
      e.preventDefault();
      props.onSearch(term);

      setTerm('');
    },
    [props, term]
  );

  const handleTermChange = useCallback((event) => {
    setTerm(event.target.value);
  }, []);

  return (
    <div className="SearchBar" onSubmit={search}>
      <input
        placeholder="search songs, artist, album..."
        value={term}
        onChange={handleTermChange}
      />
      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;
