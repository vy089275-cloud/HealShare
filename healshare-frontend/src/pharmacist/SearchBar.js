import React from "react";

function SearchBar({ searchText, setSearchText }) {
  return (
    <input
      className="search-bar"
      placeholder="Search by name"
      value={searchText}
      onChange={e => setSearchText(e.target.value)}
    />
  );
}

export default SearchBar;