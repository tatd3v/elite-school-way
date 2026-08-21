import { useState } from 'preact/hooks';
import PropTypes from 'prop-types';

function SearchBar({ onSearch, placeholder = "Buscar estudiante o casa..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
        search
      </span>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-sm"
        placeholder={placeholder}
      />
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
