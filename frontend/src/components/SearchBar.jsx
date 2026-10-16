function SearchBar({ search, setSearch, category, setCategory }) {
  const categories = ['All Categories', 'Electronics', 'Fashion', 'Books', 'Home'];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
        />
      </div>

      {/* Category Dropdown */}
      <div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 bg-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === 'All Categories' ? '' : cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchBar;

