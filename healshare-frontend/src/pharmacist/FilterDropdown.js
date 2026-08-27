import React from "react";

function FilterDropdown({ filter, setFilter }) {
  return (
    <select value={filter} onChange={e => setFilter(e.target.value)}>
      <option value="all">All</option>
      <option value="free">Free</option>
      <option value="discounted">Discounted</option>
      <option value="price">Price</option>
      <option value="expiry">Expiry</option>
    </select>
  );
}

export default FilterDropdown;