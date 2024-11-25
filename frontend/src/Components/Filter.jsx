import React, { useState, useEffect, useRef } from "react";

function Filter({ title, options, selectedOption, setSelectedOption }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Dropdown visibility
  const dropdownRef = useRef(null); // Reference to the dropdown

  const handleOptionClick = (option) => {
    setSelectedOption(option); // Update selected option
    setDropdownOpen(false); // Close dropdown after selection
  };

  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        id="dropdownButton"
        onClick={() => setDropdownOpen(!isDropdownOpen)} // Toggle dropdown
        className="me-3 mb-3 md:mb-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        aria-expanded={isDropdownOpen} // Accessibility
        aria-controls="dropdownMenu" // Accessibility
      >
        {selectedOption || title} {/* Display selected option or title */}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isDropdownOpen && ( // Render dropdown only if open
        <div
          id="dropdownMenu"
          className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          style={{ top: "100%", left: 0 }} // Position it directly below the button
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownButton"
          >
            {options.map((option) => (
              <li key={option}>
                <a
                  href="#"
                  onClick={() => handleOptionClick(option)} // Handle option click
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {option}
                </a>
              </li>
            ))}

            <li key={"213"}>
              <a
                href="#"
                onClick={() => handleOptionClick("")} // Handle option click
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Clear
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Filter;
