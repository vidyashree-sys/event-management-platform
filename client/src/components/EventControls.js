import React from "react";

export const EventControls = ({ search, setSearch, sortOrder, setSortOrder }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      {/* Search */}
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full md:w-1/2"
      />

      {/* Sort */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="border p-2 rounded w-full md:w-1/4"
      >
        <option value="newest">Sort by Newest</option>
        <option value="oldest">Sort by Oldest</option>
      </select>
    </div>
  );
};